import { NextRequest, NextResponse } from "next/server";

// Migrate to Klaviyo JSON:API
// Flow: find or create profile -> add profile to list via relationships endpoint

const KLAVIYO_API_KEY = process.env.KLAVIYO_PRIVATE_API_KEY || process.env.KLAVIYO_API_KEY || "";
const KLAVIYO_LIST_ID = process.env.KLAVIYO_LIST_ID || "";
const KLAVIYO_API_REVISION = process.env.KLAVIYO_API_REVISION || "2024-10-15";

type LocationInfo = {
  city?: string;
  region?: string;
  country?: string;
};

function getLocationFromRequest(req: NextRequest, body: any): LocationInfo | undefined {
  const bodyLoc = body?.location || {};
  const city = body?.city || bodyLoc?.city || req.headers.get("x-vercel-ip-city") || undefined;
  const region = body?.region || bodyLoc?.region || req.headers.get("x-vercel-ip-country-region") || undefined;
  const country = body?.country || bodyLoc?.country || req.headers.get("x-vercel-ip-country") || undefined;
  if (city || region || country) {
    return { city: String(city || ""), region: String(region || ""), country: String(country || "") };
  }
  return undefined;
}

async function findProfileIdByEmail(email: string): Promise<string | null> {
  const filter = encodeURIComponent(`equals(email,\"${email}\")`);
  const url = `https://a.klaviyo.com/api/profiles/?filter=${filter}`;
  const resp = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
      revision: KLAVIYO_API_REVISION,
    },
    cache: "no-store",
  });
  if (!resp.ok) return null;
  const json = await resp.json().catch(() => null) as any;
  const data = json?.data as Array<{ id: string }> | undefined;
  if (Array.isArray(data) && data.length > 0 && data[0]?.id) return data[0].id;
  return null;
}

async function createProfile(email: string, location?: LocationInfo): Promise<string> {
  const url = `https://a.klaviyo.com/api/profiles/`;
  const payload = {
    data: {
      type: "profile",
      attributes: {
        email,
        properties: {
          $source: "AI Pool Designer",
        },
        ...(location ? {
          location: {
            ...(location.city ? { city: location.city } : {}),
            ...(location.region ? { region: location.region } : {}),
            ...(location.country ? { country: location.country } : {}),
          },
        } : {}),
      },
    },
  };
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
      revision: KLAVIYO_API_REVISION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!resp.ok) {
    const details = await resp.json().catch(() => undefined);
    throw new Error(`Create profile failed: ${JSON.stringify(details)}`);
  }
  const json = await resp.json() as any;
  const id = json?.data?.id as string | undefined;
  if (!id) throw new Error("Create profile succeeded but no id returned");
  return id;
}

async function getProfileProperties(profileId: string): Promise<Record<string, unknown>> {
  const url = `https://a.klaviyo.com/api/profiles/${profileId}/`;
  const resp = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
      revision: KLAVIYO_API_REVISION,
    },
    cache: "no-store",
  });
  if (!resp.ok) return {};
  const json = await resp.json().catch(() => null) as any;
  return (json?.data?.attributes?.properties as Record<string, unknown>) || {};
}

async function updateProfileProperties(profileId: string, partial: Record<string, unknown>, location?: LocationInfo): Promise<void> {
  const current = await getProfileProperties(profileId);
  const merged = { ...current, ...partial };
  const url = `https://a.klaviyo.com/api/profiles/${profileId}/`;
  const payload = {
    data: {
      type: "profile",
      id: profileId,
      attributes: {
        properties: merged,
        ...(location ? {
          location: {
            ...(location.city ? { city: location.city } : {}),
            ...(location.region ? { region: location.region } : {}),
            ...(location.country ? { country: location.country } : {}),
          },
        } : {}),
      },
    },
  };
  const resp = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
      revision: KLAVIYO_API_REVISION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!resp.ok) {
    const details = await resp.json().catch(() => undefined);
    throw new Error(`Update profile properties failed: ${JSON.stringify(details)}`);
  }
}

async function addProfileToList(listId: string, profileId: string): Promise<void> {
  const url = `https://a.klaviyo.com/api/lists/${listId}/relationships/profiles/`;
  const payload = {
    data: [
      { type: "profile", id: profileId },
    ],
  };
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
      revision: KLAVIYO_API_REVISION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!resp.ok) {
    const details = await resp.json().catch(() => undefined);
    // Treat conflict (already in list) as success
    if (resp.status === 409) {
      return;
    }
    throw new Error(`Add profile to list failed: ${JSON.stringify(details)}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!KLAVIYO_API_KEY || !KLAVIYO_LIST_ID) {
      return NextResponse.json(
        { success: false, error: "Klaviyo API configuration missing (KLAVIYO_PRIVATE_API_KEY and/or KLAVIYO_LIST_ID)." },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body.email !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid request body. Expected JSON with 'email' string." },
        { status: 400 }
      );
    }

    const email = body.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address." },
        { status: 400 }
      );
    }

    const location = getLocationFromRequest(req, body);
    const partialProps: Record<string, unknown> | undefined = location
      ? { $source: "AI Pool Designer" }
      : undefined;

    // Find or create profile
    let profileId = await findProfileIdByEmail(email);
    if (!profileId) {
      try {
        profileId = await createProfile(email, location);
      } catch (e) {
        // If creation fails due to existing profile, try fetching again
        const msg = e instanceof Error ? e.message : String(e);
        if (/already exists|409/.test(msg)) {
          profileId = await findProfileIdByEmail(email);
        } else {
          throw e;
        }
      }
    }

    if (!profileId) {
      return NextResponse.json(
        { success: false, error: "Unable to resolve profile id for email." },
        { status: 500 }
      );
    }

    // Update properties with location info for existing profiles (if provided)
    if (partialProps) {
      try {
        await updateProfileProperties(profileId, partialProps, location);
      } catch (e) {
        // Non-fatal: continue to add to list even if property update fails
        console.warn("Failed to update profile properties", e);
      }
    }

    // Add profile to list (subscribe)
    await addProfileToList(KLAVIYO_LIST_ID, profileId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process subscription",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}


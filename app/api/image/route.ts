import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { HistoryItem, HistoryPart } from "@/lib/types";

// Initialize the Google Gen AI client with your API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
  // // @ts-ignore
  httpOptions: {
    // baseUrl: "https://api-proxy.391314.xyz/gemini"
   baseUrl:"https://api-proxy.me/gemini"
  }
});
const MODEL_ID = "gemini-2.5-flash-image-preview";

// Define interface for the formatted history item
interface FormattedHistoryItem {
  role: "user" | "model";
  parts: Array<{
    text?: string;
    inlineData?: { data: string; mimeType: string };
  }>;
}

export async function POST(req: NextRequest) {
  try {
    // Make sure we have an API key configured
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not configured");
      return NextResponse.json(
        { success: false, error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // Parse JSON request
    const requestData = await req.json().catch((err) => {
      console.error("Failed to parse JSON body:", err);
      return null;
    });
    
    if (!requestData) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { prompt, image: inputImage, history } = requestData;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 }
      );
    }

    let response;

    // Validate the image if provided
    if (inputImage) {
      if (typeof inputImage !== "string" || !inputImage.startsWith("data:")) {
        console.error("Invalid image data URL format", { inputImage });
        return NextResponse.json(
          { success: false, error: "Invalid image data URL format" },
          { status: 400 }
        );
      }
      const imageParts = inputImage.split(",");
      if (imageParts.length < 2) {
        console.error("Malformed image data URL", { inputImage });
        return NextResponse.json(
          { success: false, error: "Malformed image data URL" },
          { status: 400 }
        );
      }
      const base64Image = imageParts[1];
      // Check for non-empty and valid base64 (basic check)
      if (!base64Image || !/^([A-Za-z0-9+/=]+)$/.test(base64Image.replace(/\s/g, ""))) {
        console.error("Image data is empty or not valid base64", { base64Image });
        return NextResponse.json(
          { success: false, error: "Image data is empty or not valid base64" },
          { status: 400 }
        );
      }
    }

    try {
      // Convert history to the format expected by Gemini API
      const formattedHistory: FormattedHistoryItem[] =
        history && history.length > 0
          ? history
              .map((item: HistoryItem) => {
                return {
                  role: item.role,
                  parts: item.parts
                    .map((part: HistoryPart) => {
                      if (part.text && part.text.trim().length > 0) {
                        return { text: part.text };
                      }
                      if (part.image && item.role === "user") {
                        const imgParts = part.image.split(",");
                        if (imgParts.length > 1) {
                          return {
                            inlineData: {
                              data: imgParts[1],
                              mimeType: part.image.includes("image/png")
                                ? "image/png"
                                : "image/jpeg",
                            },
                          };
                        }
                      }
                      return null as unknown as { text?: string; inlineData?: { data: string; mimeType: string } };
                    })
                    .filter((part) => Boolean(part)), // Remove empty parts
                };
              })
              .filter((item: FormattedHistoryItem) => item.parts.length > 0) // Remove items with no parts
          : [];

      // Prepare the current message parts
      const messageParts: FormattedHistoryItem["parts"] = [];

      // Enhanced prompt with structured output request
      const enhancedPrompt = `${prompt}
      Please generate both an image and detailed text information in this JSON structure:
      {
        "designDescription": "Brief description of the pool design and key features",
        "materialSuggestions": "Recommended materials for construction",
        "costEstimate": "Estimated cost breakdown and budget considerations",
        "constructionTips": "Important construction notes and installation tips"
      }

      Make sure to provide practical, realistic suggestions for each category.`;

      messageParts.push({ text: enhancedPrompt });

      // Add the image if provided
      if (inputImage) {
        // For image editing
        console.log("Processing image edit request");

        // Check if the image is a valid data URL
        if (!inputImage.startsWith("data:")) {
          throw new Error("Invalid image data URL format");
        }

        const imageParts = inputImage.split(",");
        if (imageParts.length < 2) {
          throw new Error("Invalid image data URL format");
        }

        const base64Image = imageParts[1];
        const mimeType = inputImage.includes("image/png")
          ? "image/png"
          : "image/jpeg";
        console.log(
          "Base64 image length:",
          base64Image.length,
          "MIME type:",
          mimeType
        );

        // Add the image to message parts
        messageParts.push({
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        });
      }
      // Build final contents with current user message
      const contents: FormattedHistoryItem[] = [
        ...formattedHistory,
        {
          role: "user",
          parts: messageParts,
        },
      ];

      // Generate the content
      response = await ai.models.generateContent({
        model: MODEL_ID,
        contents,
        config: {
          temperature: 1,
          topP: 0.95,
          topK: 40,
        },
      });
    } catch (error) {
      console.error("Error in chat.sendMessage:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error in AI processing";
      return NextResponse.json(
        { success: false, error: "Gemini API error", details: errorMessage },
        { status: 500 }
      );
    }

    let textResponse = null;
    let imageData = null;
    let mimeType = "image/png";
    let designDetails = null;
   
    // Process the response
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      console.log("Number of parts in response:", parts.length);

      for (const part of parts) {
        console.log("Part:", part);
        if ("inlineData" in part && part.inlineData) {
          // Get the image data
          imageData = part.inlineData.data;
          mimeType = part.inlineData.mimeType || "image/png";
          console.log(
            "Image data received, length:",
            imageData?.length || 0,
            "MIME type:",
            mimeType
          );
        } else if ("text" in part && part.text) {
          // Store the text
          textResponse = part.text;
          console.log(
            "Text response received:",
            textResponse.substring(0, 50) + "..."
          );
          
          // Try to parse JSON from text response
          try {
            const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              designDetails = JSON.parse(jsonMatch[0]);
              console.log("Parsed design details:", designDetails);
            }
          } catch (parseError) {
            console.log("Failed to parse JSON from text response, using raw text");
          }
        }
      }
    } else {
      console.error("No response from Gemini API", { response });
      return NextResponse.json(
        { success: false, error: "No response from Gemini API" },
        { status: 500 }
      );
    }

    if (!imageData) {
      console.error("No image data in Gemini response", { response });
      return NextResponse.json(
        { success: false, error: "No image data in Gemini response" },
        { status: 500 }
      );
    }

    // Return the base64 image and design details as JSON
    return NextResponse.json({
      success: true,
      image: `data:${mimeType};base64,${imageData}`,
      description: textResponse || null,
      designDetails: designDetails || {
        designDescription: "",
        materialSuggestions: "",
        costEstimate: "",
        constructionTips: ""
      }
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate image",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

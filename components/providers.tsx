"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import type { AbstractIntlMessages } from "next-intl";

export function ThemeProviders({ children, messages }: { children: ReactNode; messages: AbstractIntlMessages }) {
  return (
    <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}

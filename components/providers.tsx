"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";

export function ThemeProviders({ children, messages }: { children: ReactNode; messages: any }) {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
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

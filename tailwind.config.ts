import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        "text-1": "var(--Text-text1)",
        "text-1-80": "var(--Text-text1-80)",
        "text-1-35": "var(--Text-text1-35)",
        "text-3": "var(--Text-text3)", 
        "blue-2": "var(--Blue-blue2)",
        "white-1": "var(--Text-white1)",
        "bg-2": "var(--Bg-bg2)",
      },
      fontFamily: {
        "brand": "var(--font-brand)",
      },
      fontSize: {
        "body-3": "var(--Fontsize-Body-3)",
        "body-4": "var(--Fontsize-Body-4)",
        "display-4": "var(--Fontsize-Display-4)",
        "display-6": "var(--Fontsize-Display-6)",
        "display-7": "var(--Fontsize-Display-7)",
      },
      lineHeight: {
        "body-3": "var(--Line-height-Body-3)",
        "body-4": "var(--Line-height-Body-4)",
        "display-4": "var(--Line-height-Display-4)",
        "display-6": "var(--Line-height-Display-6)",
        "display-7": "var(--Line-height-Display-7)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

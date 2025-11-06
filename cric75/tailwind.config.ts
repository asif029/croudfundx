import type { Config } from "tailwindcss";
import { heroui } from "@heroui/theme";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/store/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/types/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        "card-foreground": "rgb(var(--card-foreground) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        brand: {
          DEFAULT: "#023344",
          foreground: "#F1F7FA",
          soft: "#03506B",
          muted: "#0F2330",
        },
        success: {
          DEFAULT: "#0BB07B",
          foreground: "#041F15",
        },
        warning: {
          DEFAULT: "#F7B733",
          foreground: "#2E1C03",
        },
        danger: {
          DEFAULT: "#F45B69",
          foreground: "#37060C",
        },
      },
      boxShadow: {
        card: "0 24px 60px -20px rgba(2, 51, 68, 0.25)",
        "card-sm": "0 12px 30px -20px rgba(2, 51, 68, 0.2)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #023344 0%, #03506B 50%, #0A1F2B 100%)",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};

export default config;

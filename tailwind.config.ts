import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

// Design tokens live in app/globals.css (CSS variables) and are documented in DESIGN.md.
const hsl = (name: string) => `hsl(var(--${name}) / <alpha-value>)`;

const config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1120px" },
    },
    extend: {
      colors: {
        border: hsl("border"),
        input: hsl("input"),
        ring: hsl("ring"),
        background: hsl("background"),
        foreground: hsl("foreground"),
        primary: {
          DEFAULT: hsl("primary"),
          foreground: hsl("primary-foreground"),
        },
        secondary: {
          DEFAULT: hsl("secondary"),
          foreground: hsl("secondary-foreground"),
        },
        muted: { DEFAULT: hsl("muted"), foreground: hsl("muted-foreground") },
        accent: {
          DEFAULT: hsl("accent"),
          foreground: hsl("accent-foreground"),
        },
        card: { DEFAULT: hsl("card"), foreground: hsl("card-foreground") },
        brand: { DEFAULT: hsl("brand"), dark: hsl("brand-dark"), soft: hsl("brand-soft"), line: hsl("brand-line") },
        sand: { DEFAULT: hsl("sand"), dark: hsl("sand-dark"), ink: hsl("sand-ink"), soft: hsl("sand-soft"), line: hsl("sand-line") },
        success: { DEFAULT: hsl("success"), soft: hsl("success-soft"), line: hsl("success-line") },
        danger: { DEFAULT: hsl("danger"), soft: hsl("danger-soft"), line: hsl("danger-line") },
        // Neutral grey scale (eel text, wolf secondary text, hare disabled, swan borders, polar fills).
        eel: "#4B4B4B",
        wolf: "#6B6B6B",
        hare: "#AFAFAF",
        swan: "#E5E5E5",
        polar: "#F7F7F7",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Nunito Variable", "Nunito", "ui-rounded", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        quote: [
          "Iowan Old Style",
          "Palatino Linotype",
          "Palatino",
          "Georgia",
          "Cambria",
          "serif",
        ],
      },
    },
  },
  plugins: [tailwindAnimate],
} satisfies Config;

export default config;

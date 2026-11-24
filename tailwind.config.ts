import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

// Design tokens live in app/globals.css (CSS variables) and are documented in DESIGN.md.
const hsl = (name: string) => `hsl(var(--${name}) / <alpha-value>)`;

const config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
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
        brand: { DEFAULT: hsl("brand"), dark: hsl("brand-dark") },
        sand: { DEFAULT: hsl("sand"), dark: hsl("sand-dark"), ink: hsl("sand-ink") },
        success: { DEFAULT: hsl("success"), soft: hsl("success-soft") },
        danger: { DEFAULT: hsl("danger"), soft: hsl("danger-soft") },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
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

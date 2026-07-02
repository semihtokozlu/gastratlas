import type { Config } from "tailwindcss";

/**
 * Tüm renkler CSS Variables üzerinden yönetilir (src/styles/tokens.css).
 * Tema değişimi (dark) JS'siz, [data-theme] attribute'u ile çalışır.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1.5rem", screens: { "2xl": "1200px" } },
    extend: {
      colors: {
        primary: { DEFAULT: "var(--color-primary)", dark: "var(--color-primary-dark)" },
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        ink: { DEFAULT: "var(--color-text)", muted: "var(--color-text-muted)" },
        line: "var(--color-border)",
      },
      fontFamily: {
        serif: ["var(--font-serif)"],
        sans: ["var(--font-sans)"],
      },
      borderRadius: { md: "var(--radius-md)", lg: "var(--radius-lg)" },
      boxShadow: { card: "var(--shadow-card)" },
      transitionTimingFunction: { brand: "cubic-bezier(.16, 1, .3, 1)" },
    },
  },
  plugins: [],
};
export default config;

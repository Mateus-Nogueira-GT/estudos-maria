import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#08090b",
          900: "#0d0f13",
          800: "#14171d",
          700: "#1c2027",
          600: "#262b34",
          500: "#3a4150",
          400: "#5a6376",
          300: "#8a93a6",
          200: "#b6bdce",
          100: "#e4e7ef",
        },
        accent: {
          DEFAULT: "#7c9cff",
          soft: "#2b3560",
          muted: "#4a5bb8",
        },
        ok: "#3fb47c",
        warn: "#e0a341",
        err: "#d4575c",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;

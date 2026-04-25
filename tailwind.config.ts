import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
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
        pastel: {
          lilac: "#c4b5fd",
          peach: "#fed7aa",
          mint: "#a7f3d0",
          sky: "#bae6fd",
          rose: "#fda4af",
        },
        ok: "#3fb47c",
        warn: "#e0a341",
        err: "#d4575c",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        display: [
          "\"SF Pro Display\"",
          "\"SF Pro Rounded\"",
          "ui-rounded",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        "aurora-a": {
          "0%, 100%": { transform: "translate3d(0%, 0%, 0) scale(1)" },
          "33%": { transform: "translate3d(6%, -4%, 0) scale(1.06)" },
          "66%": { transform: "translate3d(-5%, 4%, 0) scale(0.96)" },
        },
        "aurora-b": {
          "0%, 100%": { transform: "translate3d(0%, 0%, 0) scale(1)" },
          "33%": { transform: "translate3d(-7%, 5%, 0) scale(0.95)" },
          "66%": { transform: "translate3d(5%, -3%, 0) scale(1.07)" },
        },
        "shine": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "aurora-a": "aurora-a 22s ease-in-out infinite",
        "aurora-b": "aurora-b 30s ease-in-out infinite",
        "shine": "shine 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

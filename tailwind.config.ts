import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ink: "#0e0f12", paper: "#faf8f4", sand: "#efebe3", line: "#dcd7cc", hero: "#2a4bff", heroDark: "#1a33c4", mint: "#d7f5e4" },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
} satisfies Config;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#07080b", 2: "#0d0f14", 3: "#14171f" },
        bone: { DEFAULT: "#ece8e1", 2: "#b9b4ab", 3: "#7d7a74" },
        saffron: { DEFAULT: "#ff8a3d", soft: "#ffb27a" },
        glacier: { DEFAULT: "#6ee7f9", soft: "#a5f0fb" },
      },
      fontFamily: {
        display: ['"Space Grotesk Variable"', '"Noto Sans Telugu"', "system-ui", "sans-serif"],
        sans: ['"Inter Variable"', "system-ui", "sans-serif"],
        serif: ['"Instrument Serif"', '"Noto Serif Devanagari"', "Georgia", "serif"],
        mono: ['"JetBrains Mono Variable"', "ui-monospace", "monospace"],
      },
      letterSpacing: { tightest: "-0.055em" },
    },
  },
  plugins: [],
}

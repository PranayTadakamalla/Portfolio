/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 221B Baker Street at night: walnut, parchment, brass lamplight, Sherlock's blue scarf, oxblood wax.
        ink: { DEFAULT: "#0f0c0a", 2: "#17120e", 3: "#211a14" },
        bone: { DEFAULT: "#efe4cf", 2: "#c2b59b", 3: "#8a7e6a" },
        brass: { DEFAULT: "#d4a94f", soft: "#e6c77f", deep: "#8c6a2a" },
        scarf: { DEFAULT: "#8fb3d9", soft: "#bcd3ea", deep: "#2c4a6e" },
        oxblood: { DEFAULT: "#8e2b2b", soft: "#b4483f" },
      },
      fontFamily: {
        display: ['"Playfair Display Variable"', '"Noto Sans Telugu"', "Georgia", "serif"],
        sans: ['"Inter Variable"', "system-ui", "sans-serif"],
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        type: ['"Special Elite"', '"Courier New"', "monospace"],
        mono: ['"JetBrains Mono Variable"', "ui-monospace", "monospace"],
      },
      letterSpacing: { tightest: "-0.04em" },
    },
  },
  plugins: [],
}

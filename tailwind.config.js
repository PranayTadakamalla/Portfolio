/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "gradient-x": "gradient-x 15s ease infinite",
        "gradient-slow": "gradient-slow 8s ease infinite alternate",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite alternate",
        float: "float 6s ease-in-out infinite",
        "circuit-flow": "circuit-flow 4s linear infinite",
      },
      keyframes: {
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "gradient-slow": {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "100% 100%" },
        },
        "pulse-glow": {
          "0%": { boxShadow: "0 0 5px rgba(6, 182, 212, 0.5)" },
          "100%": { boxShadow: "0 0 20px rgba(6, 182, 212, 0.8), 0 0 30px rgba(6, 182, 212, 0.6)" },
        },
        float: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
          "100%": { transform: "translateY(0px)" },
        },
        "circuit-flow": {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  safelist: [
    "text-cyan-500",
    "text-purple-500",
    "text-blue-500",
    "text-green-500",
    "text-pink-500",
    "text-indigo-400",
    "text-blue-400",
    "text-violet-400",
    "from-cyan-500",
    "from-purple-500",
    "from-blue-500",
    "from-green-500",
    "from-pink-500",
    "bg-cyan-500",
    "bg-purple-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-pink-500",
  ],
}

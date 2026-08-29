import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spice: {
          50: "#FBF7F0",
          100: "#F5EBDB",
          200: "#E9D3AE",
          300: "#DDB87F",
          400: "#D19A52",
          500: "#C1440E",
          600: "#A83A0C",
          700: "#8A2F0A",
          800: "#6B240A",
          900: "#4A1A08",
        },
        saffron: {
          400: "#F0B94D",
          500: "#E8A33D",
          600: "#D18C2A",
        },
        maroon: {
          500: "#7A1F1F",
          600: "#5F1717",
          700: "#4A1212",
        },
        ink: "#2B211C",
        leaf: {
          500: "#3F7D4C",
          600: "#2F6039",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-jakarta)", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(122, 31, 31, 0.10)",
        card: "0 2px 12px 0 rgba(43, 33, 28, 0.08)",
        "card-hover": "0 12px 28px 0 rgba(43, 33, 28, 0.14)",
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.35s ease-out both",
        "slide-in-right": "slide-in-right 0.3s ease-out both",
        "scale-in": "scale-in 0.2s ease-out both",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

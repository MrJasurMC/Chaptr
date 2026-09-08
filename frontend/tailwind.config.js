/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          bg: "#0B0B0F",
          surface: "#17151B",
          border: "#2A272F",
          text: "#F5F1E8",
          sub: "#9C978F",
        },
        paper: {
          bg: "#FAF7F0",
          surface: "#FFFFFF",
          border: "#E8E1D0",
          text: "#1A1A1F",
          sub: "#6B6560",
        },
        gold: {
          DEFAULT: "#D4A54A",
          bronze: "#8B7355",
          glow: "#F6C453",
        },
        wine: {
          DEFAULT: "#6E2A3A",
          deep: "#4A1B26",
        },
      },
      keyframes: {
        openLeft: {
          "0%": { transform: "rotateY(-92deg)" },
          "100%": { transform: "rotateY(0deg)" },
        },
        openRight: {
          "0%": { transform: "rotateY(92deg)" },
          "100%": { transform: "rotateY(0deg)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shelfScroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        glow: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "0.9" },
        },
      },
      animation: {
        "open-left": "openLeft 1.1s cubic-bezier(0.22,1,0.36,1) forwards",
        "open-right": "openRight 1.1s cubic-bezier(0.22,1,0.36,1) forwards",
        "fade-up": "fadeUp 0.7s ease-out forwards",
        "shelf-scroll": "shelfScroll 34s linear infinite",
        glow: "glow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

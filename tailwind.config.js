/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        classic: {
          900: "#0A1828",
          800: "#172a3f",
        },
        teal: {
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#178582",
          600: "#116a67",
          700: "#0f5e5b",
        },
        // THE FIX: Custom Palette based on #ed9d47
        gold: {
          300: "#f6c07b", // Lighter (Gradient Start)
          400: "#f2af61", // Light (Hover)
          500: "#ed9d47", // <--- YOUR EXACT COLOR
          600: "#d58231", // Darker (Gradient End)
          700: "#b0651d", // Darkest (Shadows/Borders)
        },
      },
      animation: {
        blob: "blob 10s infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

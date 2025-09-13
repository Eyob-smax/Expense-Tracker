// tailwind.config.js (ESM)
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // enable dark mode with class strategy
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}", // added for Vite/CRA structure
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"], // default font
      },
      colors: {
        // you can add custom brand colors here
        brand: {
          DEFAULT: "#2563eb", // blue-600
          light: "#3b82f6", // blue-500
          dark: "#1e40af", // blue-900
        },
      },
      borderRadius: {
        "2xl": "1rem",
      },
    },
  },
  safelist: [
    {
      pattern: /data-\[state=(checked|unchecked)\]:.*/,
    },
  ],
  plugins: [animate],
};

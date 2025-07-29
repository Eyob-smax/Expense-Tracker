// tailwind.config.js (ES6 module)
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./app/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {},
  },
  safelist: [
    {
      pattern: /data-\[state=(checked|unchecked)\]:.*/,
    },
  ],
  plugins: [animate],
};

// Location: frontend/tailwind.config.js
// Replace your old code with this CORRECTED code.

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}", // This line is an important addition
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
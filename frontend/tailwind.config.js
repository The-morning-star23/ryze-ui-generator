/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // You can add custom brand colors here if needed 
      // to keep the "Deterministic" look consistent
    },
  },
  plugins: [],
}
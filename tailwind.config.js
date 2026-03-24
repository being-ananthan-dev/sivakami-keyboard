/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'piano-black': '#1a1a1a',
        'piano-white': '#fdfdfd',
        'piano-gray': '#e5e5e5',
        'piano-active': '#3b82f6',
      },
      boxShadow: {
        'key-white': '0 8px 10px -4px rgba(0, 0, 0, 0.4), inset 0 -4px 6px -2px rgba(0, 0, 0, 0.2)',
        'key-white-active': '0 2px 4px -2px rgba(0, 0, 0, 0.4), inset 0 -2px 4px -1px rgba(0, 0, 0, 0.2)',
        'key-black': '0 4px 6px -1px rgba(0, 0, 0, 0.6), inset 0 -2px 4px -1px rgba(255, 255, 255, 0.1)',
        'key-black-active': '0 1px 2px 0 rgba(0, 0, 0, 0.6), inset 0 -1px 2px 0 rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}

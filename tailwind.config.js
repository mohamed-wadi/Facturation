/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'aptos': ['Aptos', 'sans-serif'],
        'aptos-serif': ['Aptos Serif', 'serif'],
        'calibri': ['Calibri', 'sans-serif'],
        'arial': ['Arial', 'sans-serif'],
      },
      colors: {
        'invoice-blue': '#1e3a8a',
      },
    },
  },
  plugins: [],
}
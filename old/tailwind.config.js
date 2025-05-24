/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#0A192F",
        "primary-light": "#1a273a",
        "secondary": "#F97316",
        "tertiary": "#54D6BB"
      }
    },
    screens: {


      'lg': { 'max': '2535px' },

      'md': { 'max': '1050px' },

      'sm': { 'max': '950px' },

    }
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'xsm': { 'max': '400px' },
        'sm': { 'max': '640px' },
        'md': { 'max': '996px' },
        'lg': { 'max': '1440px' },
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#42a5e3",
        secondary: "#0481bf",
      },
    },
  },

  plugins: [],
};

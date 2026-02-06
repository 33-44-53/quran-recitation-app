/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        islamic: {
          green: '#2E7D32',
          gold: '#FFD700',
          dark: '#1B5E20',
        }
      },
      fontFamily: {
        arabic: ['Segoe UI', 'Tahoma', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
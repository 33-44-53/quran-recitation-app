/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        islamic: {
          green: 'rgb(var(--primary) / <alpha-value>)',
          dark: 'rgb(var(--secondary) / <alpha-value>)',
          gold: 'rgb(var(--accent) / <alpha-value>)',
          success: 'rgb(var(--success) / <alpha-value>)',
        },
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6b7dfc',
        accent: '#8ea1ff'
      },
      boxShadow: {
        'soft': '0 10px 30px rgba(100,100,200,0.08)',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: '#fbcfe8',       // Pink 200
          'pink-light': '#fdf2f8', // Pink 50
          'pink-hover': '#f472b6', // Pink 400
          'pink-dark': '#db2777',  // Pink 600
          blue: '#bae6fd',       // Sky 200
          'blue-light': '#f0f9ff', // Sky 50
          'blue-hover': '#38bdf8', // Sky 400
          'blue-dark': '#0284c7',  // Sky 600
          lavender: '#e9d5ff',   // Purple 200
        }
      },
      fontFamily: {
        sans: ['Prompt', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(244, 114, 182, 0.12), 0 2px 6px -1px rgba(56, 189, 248, 0.08)',
        'soft-hover': '0 10px 25px -3px rgba(244, 114, 182, 0.22), 0 4px 10px -2px rgba(56, 189, 248, 0.15)',
      }
    },
  },
  plugins: [],
}

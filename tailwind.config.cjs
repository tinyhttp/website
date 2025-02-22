/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['index.md', './docs/**/*.md'],
  darkMode: 'class',
  important: true,
  theme: {
    extend: {
      screens: {
        md: '848px',
      },
    },
  },
  plugins: [],
}

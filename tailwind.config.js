/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./contracts/templates/index.html",
    "./contracts/static/*.js"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'red': '#FF3838',
        'yellow':'#FCE83A',
        'green':'#56F000'
      },
    },
  },
  plugins: [],
}


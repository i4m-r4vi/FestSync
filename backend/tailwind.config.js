/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./views/**/*.ejs",   // include all EJS files in views/
    "./public/**/*.js",   // if you use JS files with Tailwind classes
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer')
  ],
}


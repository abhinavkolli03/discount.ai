const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      extend: {
        'sans': ['Poppins', ...defaultTheme.fontFamily.sans],
        'colors': {
          'matte-black': '#111111',
          'dark': '#0D1B2A',
          'dark-shade': '#1B263B',
          'dark-mid-shade': '#415A77',
          'light-mid-shade': '#778DA9',
          'light-shade': '#E0E1DD',
        } 
      }
    },
  },
  plugins: []
}
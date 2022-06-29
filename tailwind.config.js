module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      "colors": {
        "indigo": {
          "25": "#f6f8ff"
        }
      },
      "fontFamily": {
        "inter": "Inter, sans-serif"
      },

    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

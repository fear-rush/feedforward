/** @type {import('tailwindcss').Config} */

const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["var(--font-roboto)", ...fontFamily.sans],
      },
      colors: {
        lightlime: "#abd699",
        darklime: "#8DC775",
        teal: "#75c9b7",
        darkteal: "#50BBA4",
        freshlemon: "#ffe26a",
        mint: "#c7ddcc",
        navy: "#16123f",
      },
      boxShadow: {
        cardshadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
        buttonshadow: '4.0px 8.0px 8.0px rgba(0,0,0,0.38)',
      }
    },
  },
  plugins: [],
};

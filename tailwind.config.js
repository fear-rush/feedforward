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
    },
  },
  plugins: [],
};

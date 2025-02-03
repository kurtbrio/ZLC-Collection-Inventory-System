/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#d8d8d8",
          200: "#b0b0b0",
          300: "#898989",
          400: "#616161",
          500: "#3a3a3a",
          600: "#2e2e2e",
          700: "#232323",
          800: "#171717",
          900: "#0c0c0c",
        },
        secondary: {
          100: "#efece6",
          200: "#dedacd",
          300: "#cec7b4",
          400: "#bdb59b",
          500: "#ada282",
          600: "#8a8268",
          700: "#68614e",
          800: "#454134",
          900: "#23201a",
        },
        white: {
          100: "#f5f3f1",
          200: "#ebe7e4",
          300: "#e2dcd6",
          400: "#d8d0c9",
          500: "#cec4bb",
          600: "#a59d96",
          700: "#7c7670",
          800: "#524e4b",
          900: "#292725",
        },
      },
    },
  },
  plugins: [],
};

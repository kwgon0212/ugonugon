import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        main: {
          color: "#0B798B",
          bg: "#F7F7F9",
          gray: "#D9D9D9",
          darkGray: "#717171",
        },
        warn: "#FF0000",
        selected: {
          box: "#D7F6F6",
          text: "#1D7887",
        },
      },
      spacing: {
        layout: "20px",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
};

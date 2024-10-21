/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,js,ejs}"],
  theme: {
    extend: {
      fontFamily: {
        jaro: ["Jaro", "sans-serif"], // Adiciona a fonte Jaro
        jersey: ["'Jersey 25'", "sans-serif"], // Adiciona a fonte Jersey
        body: ["Nunito", "sans-serif"], // Adiciona a fonte Nunito
        jura: ["Jura", "sans-serif"], // Adiciona a fonte Jura
        zain: ["Zain", "sans-serif"], // Adiciona a fonte Zain
      },
      colors: {
        neonGreen: "rgba(57, 255, 20, 0.7)",
        neonGreenHover: "rgba(57, 255, 20, 0.9)", // Definindo a cor personalizada
      },
    },
  },
  plugins: [],
};

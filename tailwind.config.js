/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.js",
    "./pages/**/*.{ts,tsx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        pollinationx: {
          "black":"#222222",
          "grey":"#888888",
          "honey":"#4F9D76",
          // "honey":"#286FA4",
          "purple":"#286FA4",
          // "purple":"#4F9D76",
        }
      },
      fontFamily: {
        Metropolis: ['var(--font-metropolis)']
      },
    },
  },
  plugins: [
    require("flowbite/plugin")
  ],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Pretendard Variable"] },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

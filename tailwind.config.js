/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        "content-with-ads": "calc(100vh - 21rem)",
        "mobile-content-with-ads": "calc(100vh - 18.5rem)",
        "content-without-ads": "calc(100vh - 14rem)",
        "mobile-content-without-ads": "calc(100vh - 11.5rem)",
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["winter"],
  },
};

import keepPreset from "keep-react/preset";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/keep-react/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    fontFamily: {
      sans: ['Nunito Sans', 'sans-serif'],
      },
    },
  presets: [keepPreset],
};

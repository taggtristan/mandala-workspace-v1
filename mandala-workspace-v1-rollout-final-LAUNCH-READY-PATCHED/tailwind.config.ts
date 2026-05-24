import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./modules/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        mandala: {
          charcoal:"#24241F",
          ink:"#1F2328",
          cream:"#F7F3ED",
          sand:"#E8DDCF",
          ocean:"#477F91",
          sage:"#7A9B76",
          clay:"#B75F3D",
          amber:"#D99B3D",
          plum:"#7B5C83"
        }
      }
    }
  },
  plugins: []
};

export default config;

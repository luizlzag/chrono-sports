import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        'pulse-red': {
          '0%, 100%': { backgroundColor: 'rgb(220, 38, 38)' },
          '50%': { backgroundColor: 'rgb(255, 99, 71)' },
        },
      },
      animation: {
        'pulse-red': 'pulse-red 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;

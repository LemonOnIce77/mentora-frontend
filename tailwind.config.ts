import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f4',
          100: '#ffe4e8',
          200: '#fecdd6',
          300: '#fda4b4',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          pink: '#ED3875',
          'pink-hover': '#D92361',
          'pink-light': '#FDF2F4',
          'pink-badge': '#FCE7F3',
          'yellow-note': '#FEF9C3',
          teal: '#14B8A6',
          purple: '#8B5CF6',
        },
      },
      fontFamily: {
        handwriting: ['"Caveat"', '"Comic Sans MS"', 'cursive'],
      },
    },
  },
  plugins: [],
};
export default config;

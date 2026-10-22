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
          // Skala warna utama diubah dari Rose/Pink menjadi Mentora Education Blue
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB', // Mentora Primary Blue
          700: '#1D4ED8',
          800: '#1E40AF', // Academic Deep Navy
          900: '#1E3A8A',

          // Token baru standar Mentora Blue
          blue: '#2563EB',
          'blue-hover': '#1E40AF',
          'blue-light': '#F8FAFC',
          'blue-badge': '#DBEAFE',

          // Alias kompatibilitas (agar komponen lama otomatis berubah jadi biru)
          pink: '#2563EB',
          'pink-hover': '#1E40AF',
          'pink-light': '#EFF6FF',
          'pink-badge': '#DBEAFE',

          // Warna aksen pendukung
          'yellow-note': '#FEF9C3',
          teal: '#0D9488', // Growth Teal (Skill to Learn)
          purple: '#6366F1', // Indigo akademik
        },
        mentora: {
          primary: '#2563EB',
          secondary: '#1E40AF',
          accent: '#0D9488',
          surface: '#EFF6FF',
          bg: '#F8FAFC',
          ink: '#0F172A',
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
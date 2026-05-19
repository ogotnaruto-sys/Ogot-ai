/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b0d10',
        panel: '#13161b',
        accent: '#7c5cff'
      }
    }
  },
  plugins: []
};

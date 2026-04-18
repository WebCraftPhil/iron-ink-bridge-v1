/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#edf5ff',
          100: '#d8e8ff',
          200: '#b0d0ff',
          300: '#7fb3ff',
          400: '#4b8fff',
          500: '#256ced',
          600: '#1d54bd',
          700: '#18428f',
          800: '#14356f',
          900: '#10284f',
          950: '#09162a',
        },
      },
      boxShadow: {
        panel: '0 18px 50px -28px rgba(9, 22, 42, 0.45)',
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.18) 1px, transparent 0)',
      },
      fontFamily: {
        display: ['Georgia', 'Times New Roman', 'serif'],
        body: ['Trebuchet MS', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
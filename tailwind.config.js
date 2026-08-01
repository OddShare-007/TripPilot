/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef9fb',
          100: '#d5f0f5',
          200: '#aee1eb',
          300: '#77cad9',
          400: '#3faabe',
          500: '#248fa4',
          600: '#1f738a',
          700: '#1e5d71',
          800: '#1f4d5d',
          900: '#1e414f',
          950: '#0e2a35',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f8fafb',
          border: '#e5ebed',
        },
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(0 0 0 / 0.04)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}

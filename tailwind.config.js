/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: '#f2f7ec',
          100: '#e2edcf',
          300: '#a7c779',
          500: '#5d8839',
          700: '#385b27',
          900: '#243d1b',
        },
        earth: {
          50: '#fbf6ec',
          100: '#f1dfbd',
          300: '#c99757',
          500: '#93612d',
          700: '#5f3f24',
        },
        cream: '#fff8e9',
        clay: '#b56c3a',
      },
      fontFamily: {
        sans: ['Nunito', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Merriweather', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 18px 60px rgba(66, 72, 45, 0.14)',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up-delay-1': 'fadeInUp 0.6s ease-out 0.2s forwards',
        'fade-in-up-delay-2': 'fadeInUp 0.6s ease-out 0.4s forwards',
      },
    },
  },
  plugins: [],
};

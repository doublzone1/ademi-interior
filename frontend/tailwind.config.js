/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f4f7fb',
          100: '#e7eef7',
          200: '#cadcec',
          300: '#9bbfdc',
          400: '#659cc7',
          500: '#427fb1',
          600: '#326694',
          700: '#2a5279',
          800: '#274665',
          900: '#243c55',
          950: '#172638',
        },
        accent: {
          400: '#f0a868',
          500: '#e88940',
          600: '#d96a2c',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh':
          'radial-gradient(at 20% 20%, rgba(66,127,177,0.18) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(232,137,64,0.12) 0px, transparent 50%), radial-gradient(at 100% 80%, rgba(66,127,177,0.15) 0px, transparent 50%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        shimmer: 'shimmer 2.2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
};

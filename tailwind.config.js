/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bonk-orange': '#FF5E21',
        'bonk-yellow': '#EC8C01',
        'bonk-orange2': '#DE7604',
        'bonk-dark': '#181A20',
        'bonk-card': '#23242A',
        'bonk-border': '#292B32',
        'custom-dark': '#181818',
        'header-grey': '#262626',
      },
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'sans-serif'],
      },
      keyframes: {
        glowFlow: {
          '0%': { 
            transform: 'translateY(100%)',
            opacity: '0'
          },
          '50%': { 
            opacity: '1'
          },
          '100%': { 
            transform: 'translateY(-100%)',
            opacity: '0'
          }
        }
      },
      animation: {
        'glowFlow': 'glowFlow 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};

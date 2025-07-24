/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Rubik', 'sans-serif'],
      },
      fontWeight: {
        light: 300,
      },
      colors: {
        'bonk-orange': '#ff9900',
        'explorer-bg': '#101315',
        'explorer-card': '#181c24',
        'explorer-border': '#232a3a',
      },
      borderRadius: {
        'xl': '12px',
      },
      boxShadow: {
        'explorer': '0 2px 8px 0 rgba(0,0,0,0.10)',
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

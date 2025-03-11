/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        glossy: {
          '0%, 100%': { 
            backgroundImage: 'linear-gradient(to right, rgba(251, 146, 60, 0.3), rgba(251, 146, 60, 0.1), rgba(251, 146, 60, 0.3))'
          },
          '50%': { 
            backgroundImage: 'linear-gradient(to right, rgba(251, 146, 60, 0.1), rgba(251, 146, 60, 0.3), rgba(251, 146, 60, 0.1))'
          }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
        'glossy': 'glossy 1s ease-in-out infinite'
      }
    }
  },
  plugins: [],
} 
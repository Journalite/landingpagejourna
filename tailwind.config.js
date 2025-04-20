/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
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
        'fade-in-1': 'fadeIn 0.8s ease-out forwards',
        'fade-in-2': 'fadeIn 0.8s ease-out 0.2s forwards',
        'fade-in-3': 'fadeIn 0.8s ease-out 0.4s forwards',
        'fade-in-4': 'fadeIn 0.8s ease-out 0.6s forwards',
        'fade-in-5': 'fadeIn 0.8s ease-out 0.8s forwards',
        glossy: 'glossy 1s ease-in-out infinite'
      }
    }
  },
  plugins: [],
} 
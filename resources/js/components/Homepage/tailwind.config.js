// tailwind.config.js
module.exports = {
    content: [
      "./src/**/*.{html,js,jsx,ts,tsx}", // Adjust based on your project
    ],
    theme: {
      extend: {
        animation: {
          'fade-in-right': 'fadeInRight 0.5s ease-out forwards',
          'fade-in-left': 'fadeInLeft 0.5s ease-out forwards',
        },
        keyframes: {
          fadeInRight: {
            '0%': { transform: 'translateX(100%)', opacity: '0' },
            '100%': { transform: 'translateX(0)', opacity: '1' },
          },
          fadeInLeft: {
            '0%': { transform: 'translateX(-100%)', opacity: '0' },
            '100%': { transform: 'translateX(0)', opacity: '1' },
          },
        },
      },
    },
    plugins: [],
  }
  
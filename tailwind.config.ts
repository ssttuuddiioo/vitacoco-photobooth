import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Touch-optimized sizing
      spacing: {
        'touch-min': '150px', // Minimum touch target
        'touch-comfortable': '200px',
      },
      // Kiosk-friendly animations
      transitionDuration: {
        'flash': '200ms',
      },
      animation: {
        'scale-in': 'scaleIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'flash': 'flash 0.2s ease-out',
      },
      keyframes: {
        scaleIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        flash: {
          '0%': { opacity: '1' },
          '50%': { opacity: '0.3' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;


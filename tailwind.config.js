/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        surface: {
          DEFAULT: '#ffffff',
          secondary: '#f1f5f9',
        },
        ink: {
          DEFAULT: '#0f172a',
          secondary: '#475569',
          muted: '#94a3b8',
        },
      },
      borderRadius: {
        card: '14px',
        btn:  '10px',
        input: '10px',
        badge: '9999px',
        modal: '20px',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.05), 0 1px 2px -1px rgba(0,0,0,0.04)',
        md:   '0 2px 8px 0 rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};

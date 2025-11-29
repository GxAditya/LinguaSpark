/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Main orange
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Secondary accent (pink)
        accent: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899', // Main pink
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        // Tertiary (purple)
        tertiary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7', // Main purple
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
      },
      backgroundImage: {
        // Page backgrounds
        'gradient-page': 'linear-gradient(to bottom right, rgb(255, 247, 237), rgb(253, 242, 248), rgb(250, 245, 255))',
        'gradient-hero': 'linear-gradient(to bottom right, rgb(255, 247, 237), rgb(253, 242, 248), rgb(250, 245, 255))',
        // Button gradients
        'gradient-primary': 'linear-gradient(to right, #f97316, #ec4899)',
        'gradient-primary-hover': 'linear-gradient(to right, #ea580c, #db2777)',
        'gradient-text': 'linear-gradient(to right, #1f2937, #f97316, #ec4899)',
        // Card accents
        'gradient-card-orange': 'linear-gradient(to bottom right, #ffedd5, #fce7f3)',
        'gradient-card-pink': 'linear-gradient(to bottom right, #fce7f3, #fdf2f8)',
        'gradient-card-purple': 'linear-gradient(to bottom right, #f3e8ff, #faf5ff)',
        'gradient-card-blue': 'linear-gradient(to bottom right, #dbeafe, #e0f2fe)',
        'gradient-card-green': 'linear-gradient(to bottom right, #dcfce7, #d1fae5)',
        // CTA gradient
        'gradient-cta': 'linear-gradient(to bottom right, #f97316, #ec4899, #a855f7)',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'card-hover': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'button': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'button-hover': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'glow-orange': '0 0 40px rgb(249 115 22 / 0.3)',
        'glow-pink': '0 0 40px rgb(236 72 153 / 0.3)',
        'glow-purple': '0 0 40px rgb(168 85 247 / 0.3)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-shift': 'gradient-x 15s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'gradient-x': {
          '0%, 100%': { transform: 'translateX(0%)' },
          '50%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};

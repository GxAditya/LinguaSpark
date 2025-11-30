/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Semantic Color System
        surface: {
          base: '#ffffff',
          subtle: '#fafafa', // zinc-50
          muted: '#f4f4f5',  // zinc-100
        },
        border: {
          base: '#e4e4e7',   // zinc-200
          subtle: '#f4f4f5', // zinc-100
          strong: '#d4d4d8', // zinc-300
        },
        content: {
          primary: '#18181b',   // zinc-900
          secondary: '#71717a', // zinc-500
          tertiary: '#a1a1aa',  // zinc-400
          inverse: '#ffffff',
        },
        action: {
          primary: '#18181b',
          'primary-hover': '#27272a',
          'primary-fg': '#ffffff',
          secondary: '#ffffff',
          'secondary-hover': '#fafafa',
          'secondary-border': '#e4e4e7',
          'secondary-fg': '#18181b',
        },
        brand: {
          primary: '#ea580c',        // Orange - main brand color
          'primary-hover': '#c2410c',
          'primary-light': '#fff7ed',
          'primary-border': '#ffedd5',
          secondary: '#18181b',      // Black/dark - secondary brand color
          'secondary-light': '#fafafa',
          'secondary-border': '#e4e4e7',
          accent: '#f97316',         // Lighter orange for accents
          'accent-light': '#fed7aa',
        },
        // Keep utility scales for specific needs
        zinc: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        },
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
      backgroundImage: {
        // Page backgrounds - orange/amber based
        'gradient-page': 'linear-gradient(to bottom right, rgb(255, 247, 237), rgb(254, 243, 199), rgb(255, 251, 235))',
        'gradient-hero': 'linear-gradient(to bottom right, rgb(255, 247, 237), rgb(254, 243, 199), rgb(255, 251, 235))',
        // Button gradients - orange based
        'gradient-primary': 'linear-gradient(to right, #f97316, #ea580c)',
        'gradient-primary-hover': 'linear-gradient(to right, #ea580c, #c2410c)',
        'gradient-text': 'linear-gradient(to right, #1f2937, #f97316, #ea580c)',
        // Card accents - orange/amber based
        'gradient-card-orange': 'linear-gradient(to bottom right, #ffedd5, #fef3c7)',
        'gradient-card-amber': 'linear-gradient(to bottom right, #fef3c7, #fffbeb)',
        'gradient-card-warm': 'linear-gradient(to bottom right, #fff7ed, #fef3c7)',
        'gradient-card-blue': 'linear-gradient(to bottom right, #dbeafe, #e0f2fe)',
        'gradient-card-green': 'linear-gradient(to bottom right, #dcfce7, #d1fae5)',
        // CTA gradient - orange based
        'gradient-cta': 'linear-gradient(to bottom right, #f97316, #ea580c, #c2410c)',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'card-hover': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'button': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'button-hover': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'glow-orange': '0 0 40px rgb(249 115 22 / 0.3)',
        'glow-amber': '0 0 40px rgb(245 158 11 / 0.3)',
      },
      borderRadius: {
        '2xl': '0.75rem', // Reduced from 1rem
        '3xl': '1rem',    // Reduced from 1.5rem
        '4xl': '1.5rem',  // Reduced from 2rem
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

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Semantic Color System (LinguaSpark Design System)
        surface: {
          base: 'var(--color-surface)',
          subtle: 'var(--color-surface-2)',
          muted: 'var(--color-surface-3)',
        },
        border: {
          base: 'var(--color-border)',
          subtle: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
        },
        content: {
          primary: 'var(--color-text)',
          secondary: 'var(--color-text-muted)',
          tertiary: 'var(--color-text-soft)',
          inverse: 'var(--color-surface)',
        },
        action: {
          primary: 'var(--color-accent)',
          'primary-hover': 'var(--color-accent-strong)',
          'primary-fg': 'var(--color-surface)',
          secondary: 'var(--color-surface)',
          'secondary-hover': 'var(--color-surface-2)',
          'secondary-border': 'var(--color-border)',
          'secondary-fg': 'var(--color-text)',
        },
        brand: {
          primary: 'var(--color-accent)',
          'primary-hover': 'var(--color-accent-strong)',
          'primary-light': 'rgba(var(--color-accent-rgb), 0.12)',
          'primary-ring': 'rgba(var(--color-accent-rgb), 0.2)',
          'primary-border': 'rgba(var(--color-accent-rgb), 0.3)',
          secondary: 'var(--color-ink)',
          'secondary-light': 'var(--color-surface-2)',
          'secondary-border': 'var(--color-border)',
          accent: 'var(--color-accent-2)',
          'accent-light': 'rgba(var(--color-accent-2-rgb), 0.18)',
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
          50: 'rgba(var(--color-accent-rgb), 0.08)',
          100: 'rgba(var(--color-accent-rgb), 0.12)',
          200: 'rgba(var(--color-accent-rgb), 0.18)',
          300: 'rgba(var(--color-accent-rgb), 0.28)',
          400: 'rgba(var(--color-accent-rgb), 0.45)',
          500: 'var(--color-accent)',
          600: 'var(--color-accent-2)',
          700: 'var(--color-accent-strong)',
          800: 'rgba(var(--color-accent-rgb), 0.95)',
          900: 'rgba(var(--color-accent-rgb), 1)',
        },
      },
      backgroundImage: {
        // Page backgrounds
        'gradient-page': 'linear-gradient(to bottom right, rgba(var(--color-accent-rgb), 0.08), rgba(var(--color-accent-2-rgb), 0.08), rgba(var(--color-accent-3-rgb), 0.06))',
        'gradient-hero': 'linear-gradient(to bottom right, rgba(var(--color-accent-rgb), 0.08), rgba(var(--color-accent-2-rgb), 0.08), rgba(var(--color-accent-3-rgb), 0.06))',
        // Button gradients
        'gradient-primary': 'linear-gradient(to right, var(--color-accent), var(--color-accent-2))',
        'gradient-primary-hover': 'linear-gradient(to right, var(--color-accent-2), var(--color-accent-strong))',
        'gradient-text': 'linear-gradient(to right, var(--color-ink), var(--color-accent), var(--color-accent-2))',
        // Card accents
        'gradient-card-orange': 'linear-gradient(to bottom right, rgba(var(--color-accent-rgb), 0.14), rgba(var(--color-accent-2-rgb), 0.12))',
        'gradient-card-amber': 'linear-gradient(to bottom right, rgba(var(--color-accent-2-rgb), 0.12), rgba(var(--color-accent-3-rgb), 0.1))',
        'gradient-card-warm': 'linear-gradient(to bottom right, rgba(var(--color-accent-rgb), 0.08), rgba(var(--color-accent-3-rgb), 0.1))',
        'gradient-card-blue': 'linear-gradient(to bottom right, rgba(var(--color-accent-2-rgb), 0.14), rgba(var(--color-accent-3-rgb), 0.12))',
        'gradient-card-green': 'linear-gradient(to bottom right, rgba(var(--color-accent-3-rgb), 0.12), rgba(var(--color-accent-4-rgb), 0.12))',
        // CTA gradient
        'gradient-cta': 'linear-gradient(to bottom right, var(--color-accent), var(--color-accent-2), var(--color-accent-strong))',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)',
        'card-hover': '0 20px 25px -5px rgb(0 0 0 / 0.12), 0 8px 10px -6px rgb(0 0 0 / 0.12)',
        'button': '0 10px 15px -3px rgb(0 0 0 / 0.12), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'button-hover': '0 25px 50px -12px rgb(0 0 0 / 0.22)',
        'glow-orange': '0 0 40px rgba(var(--color-accent-rgb), 0.3)',
        'glow-amber': '0 0 40px rgba(var(--color-accent-2-rgb), 0.3)',
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

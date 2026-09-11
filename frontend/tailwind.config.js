/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        dark: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float':       'float 6s ease-in-out infinite',
        'float-slow':  'float 10s ease-in-out infinite reverse',
        'glow':        'glow 2s ease-in-out infinite alternate',
        'fade-in-up':  'fadeInUp 0.6s ease-out forwards',
        'fade-in':     'fadeIn 0.5s ease-out forwards',
        'spin-slow':   'spin 10s linear infinite',
        'pulse-slow':  'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'slide-right': 'slideRight 0.5s ease-out forwards',
        'counter':     'counter 2s ease-out forwards',
        'shimmer':     'shimmer 2s infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-20px)' },
        },
        glow: {
          from: { boxShadow: '0 0 20px rgba(99,102,241,0.4)' },
          to:   { boxShadow: '0 0 60px rgba(99,102,241,0.8), 0 0 100px rgba(99,102,241,0.2)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideRight: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':   'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient':    'linear-gradient(135deg, #0a0f1e 0%, #0d1226 50%, #0a0f1e 100%)',
        'card-gradient':    'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        'primary-gradient': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        'accent-gradient':  'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)',
        'gold-gradient':    'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        'glow-primary': '0 0 30px rgba(99,102,241,0.35)',
        'glow-purple':  '0 0 30px rgba(139,92,246,0.35)',
        'glow-cyan':    '0 0 30px rgba(6,182,212,0.35)',
        'glow-gold':    '0 0 30px rgba(245,158,11,0.35)',
        'card':         '0 8px 32px rgba(0,0,0,0.4)',
        'card-hover':   '0 20px 60px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}

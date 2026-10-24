/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          900: '#090D16',
          850: '#0B0F1A',
          800: '#0D1117',
          700: '#161B22',
          600: '#1C2230',
          500: '#222938',
        },
        border: {
          DEFAULT: '#30363D',
          soft: '#21262D',
          glow: '#00F2FE',
        },
        accent: {
          cyan: '#00F2FE',
          purple: '#7928CA',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
        },
      },
      fontFamily: {
        rog: ['Orbitron', 'Share Tech Mono', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Bahnschrift', 'Segoe UI', 'Arial', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Share Tech Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0,242,254,0.45)' },
          '50%': { boxShadow: '0 0 24px 4px rgba(0,242,254,0.35)' },
        },
        'drop-active': {
          '0%, 100%': { borderColor: 'rgba(0,242,254,0.9)', transform: 'scale(1)' },
          '50%': { borderColor: 'rgba(0,242,254,1)', transform: 'scale(1.015)' },
        },
        'scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(400%)' },
        },
        'float-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.2' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 1.6s ease-in-out infinite',
        'drop-active': 'drop-active 0.9s ease-in-out infinite',
        'scan': 'scan 2.2s linear infinite',
        'float-up': 'float-up 0.4s ease-out both',
        'blink': 'blink 1s step-end infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
};

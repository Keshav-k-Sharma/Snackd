/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base:    '#080B12',
        surface: '#0F1321',
        card:    '#161C2E',
        elevated:'#1E2540',
        border:  'rgba(255,255,255,0.06)',
        primary: {
          DEFAULT: '#FF5722',
          light:   '#FF8A65',
          dark:    '#E64A19',
          glow:    'rgba(255,87,34,0.25)',
        },
        gold:    '#FFB800',
        success: '#22C55E',
        info:    '#3B82F6',
        ink:     '#F1F5FC',
        muted:   '#64748B',
        dim:     '#334155',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        glow:    '0 0 40px rgba(255,87,34,0.3)',
        'glow-sm':'0 0 20px rgba(255,87,34,0.15)',
        card:    '0 4px 32px rgba(0,0,0,0.4)',
        float:   '0 20px 60px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'ember-grad': 'linear-gradient(135deg, #FF5722 0%, #FF8C00 100%)',
        'subtle-grad':'linear-gradient(180deg, rgba(255,87,34,0.08) 0%, transparent 60%)',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)',
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'slide-up':   'slideUp 0.5s ease-out',
        'fade-in':    'fadeIn 0.4s ease-out',
        'shimmer':    'shimmer 1.8s infinite',
        'ping-slow':  'ping 2.5s cubic-bezier(0,0,0.2,1) infinite',
        'spin-slow':  'spin 8s linear infinite',
        'bounce-in':  'bounceIn 0.6s cubic-bezier(0.34,1.56,0.64,1)',
      },
      keyframes: {
        float:    { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        slideUp:  { from: { opacity:0, transform: 'translateY(20px)' }, to: { opacity:1, transform: 'translateY(0)' } },
        fadeIn:   { from: { opacity:0 }, to: { opacity:1 } },
        shimmer:  { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        bounceIn: { from: { opacity:0, transform:'scale(0.8)' }, to: { opacity:1, transform:'scale(1)' } },
      },
    },
  },
  plugins: [],
};

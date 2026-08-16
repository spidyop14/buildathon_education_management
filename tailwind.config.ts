import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        ink: {
          950: '#111114',
          900: '#18181C',
          800: '#242429',
          700: '#34343B',
          600: '#4B4B54',
          500: '#68686F',
          400: '#8C8C93',
          300: '#B4B4B9',
          200: '#DEDEE1',
          150: '#E9E9EB',
          100: '#F1F1F2',
          50: '#FAFAFA',
        },
        cobalt: {
          700: '#2C3FB0',
          600: '#3450CE',
          500: '#4361EE',
          400: '#7B92F3',
          300: '#AEBCF8',
          200: '#D3DCFB',
          100: '#E7ECFD',
          50: '#F2F5FE',
        },
        sage: {
          600: '#2F8F5B',
          500: '#3DA86D',
          400: '#5CBF88',
          200: '#B8E5CC',
          100: '#DEF3E7',
          50: '#F1FAF5',
        },
        amber: {
          600: '#B5730A',
          500: '#D4890F',
          400: '#E9A63A',
          200: '#F5D8A0',
          100: '#FBEBCF',
          50: '#FDF6E8',
        },
        rose: {
          600: '#C23A4B',
          500: '#DC4A5B',
          400: '#E87585',
          200: '#F5B5BE',
          100: '#FBDEE2',
          50: '#FDF1F2',
        },
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(17,17,20,0.03)',
        'card': '0 1px 3px rgba(17,17,20,0.04), 0 1px 2px rgba(17,17,20,0.03)',
        'elevated': '0 4px 16px rgba(17,17,20,0.06), 0 1px 4px rgba(17,17,20,0.04)',
        'hover': '0 12px 40px rgba(17,17,20,0.08), 0 4px 12px rgba(17,17,20,0.04)',
        'pop': '0 24px 60px rgba(17,17,20,0.14), 0 8px 20px rgba(17,17,20,0.06)',
        'glow': '0 0 40px rgba(67,97,238,0.12)',
        'glow-lg': '0 0 80px rgba(67,97,238,0.15), 0 0 30px rgba(67,97,238,0.08)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #FAFAFA 0%, #F2F5FE 50%, #FAFAFA 100%)',
        'gradient-dark': 'linear-gradient(145deg, #18181C 0%, #111114 100%)',
        'gradient-ai': 'linear-gradient(135deg, #111114 0%, #1a1a2e 40%, #16213e 100%)',
        'gradient-cobalt': 'linear-gradient(135deg, #4361EE 0%, #3450CE 100%)',
        'gradient-surface': 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)',
        'gradient-radial': 'radial-gradient(circle at 50% 0%, rgba(67,97,238,0.08) 0%, transparent 60%)',
        'gradient-radial-lg': 'radial-gradient(ellipse at 50% -20%, rgba(67,97,238,0.12) 0%, transparent 70%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'circle-progress': {
          from: { strokeDashoffset: 'var(--circle-circumference, 264)' },
          to: { strokeDashoffset: 'var(--circle-offset, 0)' },
        },
      },
      animation: {
        'circle-progress': 'circle-progress 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
};

export default config;

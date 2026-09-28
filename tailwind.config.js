// tailwind.config.js

import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', ...fontFamily.sans],
        display: ['Sora', 'Manrope', ...fontFamily.sans],
      },
      colors: {
        white: 'rgb(var(--color-strong) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          hover: 'rgb(var(--color-primary-hover) / <alpha-value>)',
          soft: '#115E59', 
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          hover: 'rgb(var(--color-accent-hover) / <alpha-value>)',
          glow: '#A3E635', 
        },
        'on-accent': 'rgb(var(--color-on-accent) / <alpha-value>)',
        dark: {
          background: 'rgb(var(--color-background) / <alpha-value>)',
          surface: 'rgb(var(--color-surface) / <alpha-value>)',
          surface_hover: 'rgb(var(--color-surface-hover) / <alpha-value>)',
          text: 'rgb(var(--color-text) / <alpha-value>)',
          subtle: 'rgb(var(--color-subtle) / <alpha-value>)',
        },
        // Cores semânticas para status
        status: {
          pending: '#F59E0B', // Amarelo/Laranja
          success: '#22C55E', // Verde
          danger: '#EF4444', // Vermelho
          danger_hover: '#DC2626',
        }
      },
      // Efeito de sombra/brilho
      boxShadow: {
        'glow-accent': '0 14px 32px -14px rgba(199, 243, 107, 0.5)',
        'glow-primary': '0 18px 45px -22px rgba(23, 61, 54, 0.45)',
        'glow-danger': '0 0 16px 0 rgba(239, 68, 68, 0.3)',
        'soft': '0 24px 70px -35px rgba(17, 42, 36, 0.35)',
      },
      // Animação de pulso mais sutil
      keyframes: {
        subtlePulse: {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 0 0 rgba(163, 230, 53, 0.4)' },
          '50%': { opacity: 0.9, boxShadow: '0 0 12px 10px rgba(163, 230, 53, 0)' },
        }
      },
      animation: {
        'subtle-pulse': 'subtlePulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

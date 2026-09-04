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
        sans: ['Inter', ...fontFamily.sans],
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
          danger: '#EF4444', // Vermelho
          danger_hover: '#DC2626',
        }
      },
      // Efeito de sombra/brilho
      boxShadow: {
        'glow-accent': '0 0 16px 0 rgba(163, 230, 53, 0.3)',
        'glow-primary': '0 0 16px 0 rgba(13, 148, 136, 0.3)',
        'glow-danger': '0 0 16px 0 rgba(239, 68, 68, 0.3)',
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

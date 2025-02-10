import { join } from 'path';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    join(__dirname, './src/**/*.{svelte,js,ts}'),
  ],
  theme: {
    extend: {
      colors: {
        discord: {
          blurple: '#5865F2',
          green: '#57F287',
          yellow: '#FEE75C',
          fuchsia: '#EB459E',
          red: '#ED4245',
          white: '#FFFFFF',
          black: '#23272A',
          'dark-but-not-black': '#2C2F33',
          'not-quite-black': '#23272A',
          'blurple-dark': '#4752C4',
          'green-dark': '#3BA55C',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 
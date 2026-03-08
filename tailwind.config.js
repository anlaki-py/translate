/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        app:           '#000000',
        surface:       '#1c1c1e',
        input:         '#1c1c1e',
        output:        '#151517',
        accent:        '#0a84ff',
        textPrimary:   '#ffffff',
        textSecondary: '#98989d',
      },
      fontFamily: {
        mono: ['CustomMono', 'SF Mono', 'Menlo', 'monospace'],
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'Segoe UI', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0'  },
        },
        blink: {
          '50%': { opacity: '0' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        blink:   'blink 1s step-end infinite',
      },
    },
  },
  plugins: [],
}

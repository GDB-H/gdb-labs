/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F3F1EC',
        'paper-2': '#E8E5DE',
        ink: '#121214',
        'ink-2': '#1C1C20',
        muted: '#6B6964',
        'muted-dark': '#9C9A94',
        accent: '#EE5420',
        line: 'rgba(18, 18, 20, 0.12)',
        'line-dark': 'rgba(243, 241, 236, 0.14)',
      },
      fontFamily: {
        sans: ['"Inter Tight"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-1': ['clamp(3.4rem, 11.5vw, 11.5rem)', { lineHeight: '0.88', letterSpacing: '-0.05em' }],
        'display-2': ['clamp(2.6rem, 6.4vw, 6.25rem)', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
        'display-3': ['clamp(1.6rem, 3vw, 2.6rem)', { lineHeight: '1.08', letterSpacing: '-0.03em' }],
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

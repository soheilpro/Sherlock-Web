const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './scripts/components/**/*.tsx',
  ],
  theme: {
    screens: {
      'mx': { 'max':  '100vw' },
      'xl': { 'max': '1279px' },
      'lg': { 'max': '1023px' },
      'md': { 'max':  '767px' },
      'sm': { 'max':  '639px' },
    },
    extend: {
      colors: {
        gray: colors.stone,
        'primary': {
          'DEFAULT': '#57534e',
        },
      },
      minWidth: {
        '40': '10rem',
        '64': '16rem',
      },
    },
  },
  plugins: [
    require('tailwindcss-touch')(),
  ],
};

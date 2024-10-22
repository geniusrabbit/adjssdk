/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  prefix: '',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'postcss-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'postcss-loader',
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  // darkMode: ['variant', '&:not(.light *)', 'media', '[data-mode="dark"]'],
  // darkMode: ['variant', '&:not(.light *)', 'media'],
  darkMode: ['variant', [
    '@media (prefers-color-scheme: dark) { &:not(.light *) }',
    '&:is(.dark *)',
  ], 'class'],
  // darkMode: ['&:not(.light *)', 'selector', 'media', 'class'],
  // darkMode: '[data-mode="bbb"]', // or 'media' or 'class'
  content: [
    './**/*.{html,gohtml,js,jsx,tsx}',
    './private/templates/**/*.{html,gohtml,js,jsx,tsx}',
  ],
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
    },
  },
  theme: {
    // colors: {
    //   "primary": "rgb(30 30 30)",
    // },
    extend: {
      colors: {
        "primary": "rgb(30 30 30)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    // require('@tailwindcss/container-queries'),
    // require('flowbite/plugin'),
  ],
}
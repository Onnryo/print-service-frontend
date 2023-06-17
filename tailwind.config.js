const formKitTailwind = require('@formkit/themes/tailwindcss')

module.exports = {
  mode: 'jit',
  //purge: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  content: ['./index.html', './src/*.{js,jsx,vue}', './src/**/*.{js,jsx,vue}'],
  media: false,
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: [
    formKitTailwind
  ]
}

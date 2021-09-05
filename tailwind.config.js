module.exports = {
  mode: 'jit',
  purge: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  darkMode: false,
  theme: {
    fontFamily: {
      sans: ['"proxima-nova"', '"Open Sans"', '"Gill Sans MT"', '"Gill Sans"', 'Corbel', 'Helvetica', 'Arial', 'sans-serif']
    },        
    fontSize: {
      base: '1.0625rem',
      lg: '1.3125rem',
      xl: '1.6875rem',
      '2xl': '2.125rem',
      '3xl': '2.75rem',
      '4xl': '3.5rem',
    },
    colors: {
      black: {
        DEFAULT: 'rgba(0, 0, 0, 1)',
      },
      white: {
        DEFAULT: 'rgba(255, 255, 255, 1)',
      },
      red: {
        DEFAULT: 'rgba(245, 79, 68, 1)',
      },
      yellow: {
        DEFAULT: 'rgba(248, 190, 42, 1)',
      },
      teal: {
        DEFAULT: 'rgba(3, 208, 183, 1)',
      },
      blue: {
        DEFAULT: 'rgba(60, 153, 239, 1)',
      },
      purple: {
        DEFAULT: 'rgba(117, 56, 173, 1)',
      },
      gray: {
        '50': 'rgba(8, 9, 11, 1)',
        '100': 'rgba(22, 24, 28, 1)',
        '200': 'rgba(41, 47, 55, 1)',
        '300': 'rgba(65, 72, 82, 1)',
        '400': 'rgba(86, 94, 107, 1)',
        '500': 'rgba(112, 122, 137, 1)',
        '600': 'rgba(133, 145, 161, 1)',
        '700': 'rgba(158, 170, 188, 1)',
        '800': 'rgba(185, 196, 211, 1)',
        '900': 'rgba(219, 227, 239, 1)',
      },
    },
  }
}

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
      base: '1rem',
      lg: '1.25rem',
      xl: '1.5625rem',
      '2xl': '2rem',
      '3xl': '2.5625rem',
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
        DEFAULT: 'rgba(59, 214, 205, 1)',
      },
      blue: {
        DEFAULT: 'rgba(60, 153, 239, 1)',
      },
      purple: {
        DEFAULT: 'rgba(143, 79, 254, 1)',
      },
      gray: {
        50: 'rgba(8, 9, 11, 1)',
        100: 'rgba(20, 22, 25, 1)',
        200: 'rgba(41, 47, 55, 1)',
        300: 'rgba(65, 72, 82, 1)',
        400: 'rgba(86, 94, 107, 1)',
        500: 'rgba(112, 122, 137, 1)',
        600: 'rgba(133, 145, 161, 1)',
        700: 'rgba(158, 170, 188, 1)',
        800: 'rgba(185, 196, 211, 1)',
        900: 'rgba(219, 227, 239, 1)',
      },
    },
  }
}

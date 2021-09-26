
module.exports = {
  mode: 'jit',
  purge: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/aspect-ratio')
  ],
  theme: {
    extend: {
      screens: {
        'fine': {'raw': '(pointer: fine)'},
        'coarse': {'raw': '(pointer: coarse)'},
      }  
    },
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
      transparent: {
        DEFAULT: 'transparent'
      },
      black: {
        DEFAULT: 'var(--white)',
      },
      white: {
        DEFAULT: 'var(--white)',
      },
      red: {
        DEFAULT: 'var(--red)',
      },
      yellow: {
        DEFAULT: 'var(--yellow)',
      },
      teal: {
        DEFAULT: 'var(--teal)',
      },
      blue: {
        DEFAULT: 'var(--blue)',
      },
      purple: {
        DEFAULT: 'var(--purple)',
      },
      gray: {
        '50': 'var(--gray-50)',
        '100': 'var(--gray-100)',
        '200': 'var(--gray-200)',
        '300': 'var(--gray-300)',
        '400': 'var(--gray-400)',
        '500': 'var(--gray-500)',
        '600': 'var(--gray-600)',
        '700': 'var(--gray-700)',
        '800': 'var(--gray-800)',
        '900': 'var(--gray-900)',
      },
    },
  }
}

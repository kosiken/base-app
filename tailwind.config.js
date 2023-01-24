/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      dropShadow: {
       btnShadow: '7px 7px 0 0 rgba(0, 0, 0, 0.6)',
       btnDarkShadow: '7px 7px 0 0 rgba(223, 217, 249, 0.58)'
      },
      colors: {
        primary: '#1E1C1A',
        secondary: '#DFD9F9',
        darkGray: '#333333',
        otherColor: '#F9E8D9',
        blue: {
          cool: '#e6ebff',
          cool2: '#e0e7ff',
          navy: '#061938',
          ink: '#242582',
          ocean: '#F8FAFB',
          offBlue: '#8798AD',
          bodyLighter: '#778CA2',
        },
        grey: {
          offWhite: '#F2F2F2',
          lightGray: '#B4BAC3',
          graySuit: '#6A7588',
          dark: '#333333',
          title: '#2B3A4B',
          another: '#F4F6F9',
        },
      },

      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.5rem',
        '2xl': '2.5rem',
        '4xl': '4rem',
      },
      boxShadow: {
        primaryBtnShadow: '7px 7px 0 0 rgb(223 217 249 / 58%)',
        card: '0px 4px 200px #F4F6F9',
        btnShadow: '7px 7px 0 0 rgba(0, 0, 0, 0.6)',
        btnDarkShadow: '7px 7px 0 0 rgba(223, 217, 249, 0.58)'
      },
      screens: {
        'sm': '640px',
        // => @media (min-width: 640px) { ... }
  
        'md': '768px',
        // => @media (min-width: 768px) { ... }
  
        'lg': '1024px',
        // => @media (min-width: 1024px) { ... }
  
        'xl': '1280px',
        // => @media (min-width: 1280px) { ... }
  
        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }
      }
    },
  },
  plugins: [],
}

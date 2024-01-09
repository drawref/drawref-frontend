/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          '50': '#f1f8fd',
          '100': '#dfeffa',
          '200': '#c7e3f6',
          '300': '#a0d2f0',
          '400': '#73b8e7',
          '500': '#529cdf',
          '600': '#4788d5',
          '700': '#346dc1',
          '800': '#30599d',
          '900': '#2b4c7d',
          '950': '#1e304d',
        },
        secondary: {
          '50': '#fdf2f6',
          '100': '#fce7ef',
          '200': '#fac2d6',
          '300': '#f9a8c3',
          '400': '#f4729b',
          '500': '#ec4876',
          '600': '#db2751',
          '700': '#be183a',
          '800': '#9d1731',
          '900': '#83182c',
          '950': '#500715',
        },
        defaultText: '#0d2748',
      },
    },
  },
  plugins: [],
}


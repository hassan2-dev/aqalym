/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E275E',
          50: '#EEF0F7',
          100: '#D5D9EB',
          200: '#ABB3D7',
          300: '#818DC3',
          400: '#5767AF',
          500: '#1E275E',
          600: '#1A2252',
          700: '#151C45',
          800: '#111639',
          900: '#0C102C',
        },
        secondary: {
          DEFAULT: '#6E7078',
          50: '#F4F4F5',
          100: '#E8E8EA',
          200: '#D1D2D5',
          300: '#BABBBF',
          400: '#8A8B92',
          500: '#6E7078',
          600: '#585A61',
          700: '#434449',
          800: '#2D2E31',
          900: '#171819',
        },
        accent: {
          DEFAULT: '#B08A5A',
          50: '#F8F4EF',
          100: '#F0E8DE',
          200: '#E1D1BD',
          300: '#D2BA9C',
          400: '#C1A27B',
          500: '#B08A5A',
          600: '#8D6E48',
          700: '#6A5336',
          800: '#463724',
          900: '#231C12',
        },
        background: {
          DEFAULT: '#F7F8FA',
        },
        card: {
          DEFAULT: '#FFFFFF',
        },
        border: {
          DEFAULT: '#E8EAEE',
        },
      },
      fontFamily: {
        arabic: ['IBMPlexSansArabic_400Regular'],
        'arabic-medium': ['IBMPlexSansArabic_500Medium'],
        'arabic-semibold': ['IBMPlexSansArabic_600SemiBold'],
        'arabic-bold': ['IBMPlexSansArabic_700Bold'],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        soft: '0 4px 24px rgba(30, 39, 94, 0.06)',
        card: '0 8px 32px rgba(30, 39, 94, 0.08)',
      },
    },
  },
  plugins: [],
};

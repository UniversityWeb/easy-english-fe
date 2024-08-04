import { extendTheme } from '@chakra-ui/react';

const customTheme = extendTheme({
  fonts: {
    body: "'Nunito Sans', sans-serif",
    heading: "'Nunito Sans', sans-serif",
  },
  colors: {
    customBlue: {
      500: '#007AFF',
    },
    gold: {
      500: '#FFB546',
    },
  },
  fontSizes: {
    xs: '1.2rem',
    sm: '1.4rem',
    md: '1.6rem',
    lg: '1.8rem',
    xl: '2rem',
    '2xl': '2.4rem',
    '3xl': '3rem',
    '4xl': '3.6rem',
    '5xl': '4.8rem',
    '6xl': '6rem',
    '7xl': '7.2rem',
    '8xl': '9.6rem',
    '9xl': '12.8rem',
  },
  lineHeights: {
    normal: 'normal',
    none: '1.6rem',
    shorter: '2rem',
    short: '2.2rem',
    base: '2.5rem',
    tall: '2.6rem',
    taller: '3.2rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
  },
});

export default customTheme;

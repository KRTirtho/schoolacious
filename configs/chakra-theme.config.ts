import {
  extendTheme,
  withDefaultColorScheme,
  theme as base,
  ChakraTheme,
} from '@chakra-ui/react';

const theme = extendTheme(
  {
    colors: {
      primary: base.colors.green,
      textPrimary: '#272727',
      textSecondary: '#777777',
    },
    components: {
      Link: { baseStyle: { color: 'green.500' } },
    },
  } as Partial<ChakraTheme>,
  withDefaultColorScheme({ colorScheme: 'primary' })
);
export default theme;

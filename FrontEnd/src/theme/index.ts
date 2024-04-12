import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { colors } from './base/colors';
import { sizes } from './base/sizes';
import Table from './components/Table';

export const theme = extendTheme({
  styles: {
    global: (props: any) => ({
      body: {
        bg: mode(colors.app.background.body.light, colors.app.background.body.dark)(props),
      },
    }),
  },
  colors: { ...colors },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  sizes: { ...sizes },
  fonts: {
    heading: 'Neue Machina Regular',
    body: 'Graphik Web',
  },
  components: {
    Table,
  },
});

type Theme = typeof theme;

export type { Theme };

import { ThemeProvider } from '@material-ui/styles';
import React from 'react';
import useMyTheme from './hooks/useMyTheme';
export default function MultiThemeProvider(props) {
  const { theme } = useMyTheme();
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
}

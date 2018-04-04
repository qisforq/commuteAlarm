import * as React from 'react';
import { AppRegistry } from 'react-native';
import App from './client/components/App';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    accent: 'yellow',
  },
};

export default function Main() {
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}



AppRegistry.registerComponent('commuteAlarm', () => App);

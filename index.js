import * as React from 'react';
import { AppRegistry } from 'react-native';
import App from './client/components/App';
import { DefaultTheme, ThemeProvider } from 'react-native-ios-kit';
import color from 'color';

const theme = {
  ...DefaultTheme,
  primaryColor: 'tomato',
  primaryLightColor: color('tomato').lighten(0.2).rgb().string(),
  disabledColor: 'yellow',
};


export default function Main() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}



AppRegistry.registerComponent('commuteAlarm', () => App);

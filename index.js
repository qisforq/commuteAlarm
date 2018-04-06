import * as React from 'react';
import { AppRegistry } from 'react-native';
import App from './client/components/App';

console.disableYellowBox = true;

export default function Main() {
  return (
    <App />
  );
}



AppRegistry.registerComponent('commuteAlarm', () => App);

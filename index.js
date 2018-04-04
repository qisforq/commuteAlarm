import * as React from 'react';
import { AppRegistry } from 'react-native';
import App from './client/components/App';


export default function Main() {
  return (

      <App />
  );
}



AppRegistry.registerComponent('commuteAlarm', () => App);

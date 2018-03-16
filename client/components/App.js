import React from 'react';
import LoginScreen from './LoginScreen';
import AlarmsScreen from './AlarmsScreen';
import {Button, View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';


const RootStack = StackNavigator(
  {
    LoginScreen: {
      screen: LoginScreen,
    },
    AlarmsScreen: {
      screen: AlarmsScreen,
    },
  },
  {
    initialRouteName: 'LoginScreen',
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
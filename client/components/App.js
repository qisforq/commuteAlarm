import React from 'react';
import LoginScreen from './LoginScreen';
import AlarmsScreen from './AlarmsScreen';
import AddScreen from './AddScreen';
import SettingsScreen from './SettingsScreen';
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
    SettingsScreen: {
      screen: SettingsScreen,
    },
    AddScreen: {
      screen: AddScreen,
    }
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


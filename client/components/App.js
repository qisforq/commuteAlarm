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
      headerLeft: null,
    },
    AlarmsScreen: {
      screen: AlarmsScreen,
      headerLeft: null,
    },
    SettingsScreen: {
      screen: SettingsScreen,
      headerLeft: null,
    },
    AddScreen: {
      screen: AddScreen,
      headerLeft: null,
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
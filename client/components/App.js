import React from 'react';
import AlarmsScreen from './AlarmsScreen';
import AddScreen from './AddScreen';
import SettingsScreen from './SettingsScreen';
import CalendarScreen from './CalendarScreen';
import {Button, View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';

const RootStack = StackNavigator(
  {
    AlarmsScreen: {
      screen: AlarmsScreen,
    },
    SettingsScreen: {
      screen: SettingsScreen,
    },
    AddScreen: {
      screen: AddScreen,
    },
    CalendarScreen: {
      screen: CalendarScreen,
    }
  },
  {
    initialRouteName: 'AlarmsScreen',
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}

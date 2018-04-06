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
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#33b8bd',
      },
      headerTintColor: '#f5f5f5',
      headerTitleStyle: {
        fontWeight: 'bold',
        letterSpacing: 1,
        fontFamily: 'Pacifico',
        fontSize: 22,
      },
    }
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}

import React from 'react';
import BottomNavigation from './BottomNavigation';
import {Button, View, Text } from 'react-native';
import { NavigationActions } from 'react-navigation'


const backAction = NavigationActions.back({
  key: null
}) 

export default class SettingsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Settings Screen</Text>
        <BottomNavigation />
      </View>
    );
  }
}
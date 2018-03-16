import React from 'react';
import BottomNavigation from './BottomNavigation';
import {Button, View, Text } from 'react-native';


export default class LoginScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
        <Text>Login Screen</Text>
        <BottomNavigation />
      </View>
    );
  }
}
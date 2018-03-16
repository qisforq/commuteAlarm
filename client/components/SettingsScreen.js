import React from 'react';
import BottomNavigation from './BottomNavigation';
import {Button, View, Text, TextInput } from 'react-native';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
    headerLeft: null,
  };
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
        <View></View>
        <BottomNavigation nav={this.props.navigation}/>
      </View>
    );
  }
}
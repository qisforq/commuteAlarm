import React from 'react';
import BottomNavigation from './BottomNavigation';
import {Button, View, Text } from 'react-native';

export default class AlarmssScreen extends React.Component {
  static navigationOptions = {
    title: 'Alarms',
    headerLeft: null,
  };
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
        <BottomNavigation nav={this.props.navigation}/>
      </View>
    );
  }
}
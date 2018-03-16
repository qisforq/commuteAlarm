import React from 'react';
import {Button, View, Text, StyleSheet } from 'react-native';

export default class BottomNavigation extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', maxHeight: 70 }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', maxHeight: 30 }}>
          <Button
            title="Login Screen"
            onPress={() => this.props.nav.navigate('LoginScreen')}
          />
          <Button
            title="Alarms Screen"
            onPress={() => this.props.nav.navigate('AlarmsScreen')}
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', maxHeight: 30 }}>
          <Button
            title="Settings Screen"
            onPress={() => this.props.nav.navigate('SettingsScreen')}
          />
          <Button
            title="Edit/Add Screen"
            onPress={() => this.props.nav.navigate('AddScreen')}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
  },
});
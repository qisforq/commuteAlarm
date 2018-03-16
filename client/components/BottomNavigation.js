import React from 'react';
import {Button, View, Text, StyleSheet } from 'react-native';


export default class AlarmssScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' }}>
          <Button
            title="Login Screen"
            onPress={() => this.props.navigation.dispatch(backAction)}
          />
          <Button
            title="Alarms Screen"
            onPress={() => this.props.navigation.dispatch(backAction)}
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' }}>
          <Button
            title="Settings Screen"
            onPress={() => this.props.navigation.dispatch(backAction)}
          />
          <Button
            title="Edit/Add Screen"
            onPress={() => this.props.navigation.dispatch(backAction)}
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
import React from 'react';
import BottomNavigation from './BottomNavigation';
import {Button, View, Text, TextInput } from 'react-native';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    };
  }
  static navigationOptions = {
    title: 'Login',
    headerLeft: null,
  };
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
        <Text>{this.state.text}</Text>
        <TextInput
          placeholder="Username"
          onChangeText={(text) => this.setState({text})}
        />
        <BottomNavigation nav={this.props.navigation}/>
      </View>
    );
  }
}

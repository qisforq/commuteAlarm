import React from 'react';
import axios from 'axios';
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
        <View></View>
        <View>
          <Text>{this.state.text}</Text>
          <TextInput
            placeholder="Username"
            onChangeText={(text) => this.setState({text})}
          />
          <Button
            title="Send"
            onPress={() => {
              axios.get('http://localhost:8082/test').then(data => {
                console.log('herer');
                this.setState({text: data.data})
              });
            }}
          />
        </View>
        <BottomNavigation nav={this.props.navigation}/>
      </View>
    );
  }
}

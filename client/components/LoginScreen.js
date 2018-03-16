import React from 'react';
import axios from 'axios';
import BottomNavigation from './BottomNavigation';
import {Button, View, Text, TextInput, AsyncStorage } from 'react-native';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      userId: null,
      first: false
    };
  }
  static navigationOptions = {
    title: 'Login',
    headerLeft: null,
  };

  componentDidMount() {
    AsyncStorage.getItem('userId').then(id => {
      if(id === null) {
        AsyncStorage.setItem('userId', '1');
        this.setState({
          userId: 1,
          first: true,
        }, () => {
          this.props.navigation.navigate('SettingsScreen', {
            userId: this.state.userId,
          });
        });
      }
    });
  }

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

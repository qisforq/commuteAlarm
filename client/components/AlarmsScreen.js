import React from 'react';
import axios from 'axios';
import BottomNavigation from './BottomNavigation';
import {Button, View, Text, AsyncStorage } from 'react-native';
import store from 'react-native-simple-store';

export default class AlarmssScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      first: false,
      userSettings: {
        defaultPrepTime: 0,
        defaultPostTime: 0,
        defaultSnoozes: 0,
      },
    };
  }

  static navigationOptions = {
    title: 'Alarms',
    headerLeft: null,
  };

  componentDidMount() {
    store.get('userId').then(id => {
      if (id === null) {
        axios.get('http://localhost:8082/user/new').then((data) => {
          store.save('userId', data.data)
          store.save('alarms', {})
          store.save('userSettings', {
            defaultPrepTime: 0,
            defaultPostTime: 0,
            defaultSnoozes: 0,
          })
          this.setState({
            userId: data.data,
            first: true,
          }, () => {
            this.props.navigation.navigate('SettingsScreen', {
              userId: this.state.userId,
            });
          });
        });
      } else {
        store.get('userSettings').then((settings) => {
          this.setState({
            userId: id,
            userSettings: settings,
          });
        })
      }
    });
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
        <View></View>
        <BottomNavigation
          userId={this.state.userId}
          cur={1}
          nav={this.props.navigation}
          userSettings={this.state.userSettings}
          updateUserSettings={(prep, post, snooze) => {
            this.setState({
              userSettings: {
                defaultPrepTime: prep,
                defaultPostTime: post,
                defaultSnoozes: snooze,
              }
            })
          }}
        />
      </View>
    );
  }
}

import React from 'react';
import BottomNavigation from './BottomNavigation';
import {Button, View, Text, AsyncStorage } from 'react-native';
import store from 'react-native-simple-store';

export default class AlarmssScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      first: false
    };
  }

  static navigationOptions = {
    title: 'Alarms',
    headerLeft: null,
  };

  componentDidMount() {
    store.get('userId').then(id => {
      if (id === null) {
        store.save('userId', '1')
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
        <BottomNavigation cur={1} nav={this.props.navigation}/>
      </View>
    );
  }
}

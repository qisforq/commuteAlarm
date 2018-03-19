import React from 'react';
import axios from 'axios';
import BottomNavigation from './BottomNavigation';
import {Button, View, Text, AsyncStorage } from 'react-native';
import store from 'react-native-simple-store';
import BackgroundTask from 'react-native-background-task';
import RNCalendarEvents from 'react-native-calendar-events';

BackgroundTask.define(async () => {
  // Fetch some data over the network which we want the user to have an up-to-
  // date copy of, even if they have no network when using the app
  // const response = await fetch('http://feeds.bbci.co.uk/news/rss.xml')
  // const text = await response.text()
  
  // // Data persisted to AsyncStorage can later be accessed by the foreground app
  // await store.save('bbc', text).then(console.log(store.get('bbc')));
  store.save('stuff', 'works');
  // Remember to call finish()
  BackgroundTask.finish()
})

export default class AlarmssScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      first: false,
      stuff: 'no'
    };
  }

  static navigationOptions = {
    title: 'Alarms',
    headerLeft: null,
  };

  componentDidMount() {
    console.log('runs');
    BackgroundTask.schedule();
    store.get('userId').then(id => {
      if (id === null) {
        axios.get('http://localhost:8082/user/new').then((data) => {
          store.save('userId', data.data)
          store.save('alarms', {})
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
        this.setState({
          userId: id,
        });
      }
    });
    store.get('stuff').then(dat => {
      this.setState({
        stuff: dat ? dat : 'no',
      });
    })
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text>{this.state.stuff}</Text>
        </View>
        <BottomNavigation userId={this.state.userId} cur={1} nav={this.props.navigation}/>
      </View>
    );
  }
}

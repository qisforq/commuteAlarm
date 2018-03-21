import React from 'react';
import axios from 'axios';
import BottomNavigation from './BottomNavigation';
import { Alert, Button, View, Text, TouchableHighlight, AsyncStorage, Slider, FlatList, StyleSheet, ListItem, RefreshControl, PushNotificationIOS } from 'react-native';
import dummyData from '../../server/dummyData';
import store from 'react-native-simple-store';
import BackgroundTask from 'react-native-background-task';
import RNCalendarEvents from 'react-native-calendar-events';
import PushNotification from 'react-native-push-notification';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import HeaderButton from 'react-navigation-header-buttons'
import Icon from 'react-native-vector-icons/Ionicons.js';
import Swipeout from 'react-native-swipeout';

//var PushNotification = require('react-native-push-notification');

BackgroundTask.define(async () => {
  axios.get('http://localhost:8082/commutetime', {
    params: {
      userId: this.state.userId
    }
  })
  // Fetch some data over the network which we want the user to have an up-to-
  // date copy of, even if they have no network when using the app
  // const response = await fetch('http://feeds.bbci.co.uk/news/rss.xml')
  // const text = await response.text()

  // // Data persisted to AsyncStorage can later be accessed by the foreground app
  // await store.save('bbc', text).then(console.log(store.get('bbc')));
  store.save('stuff', 'works');
  // Remember to call finish()
  BackgroundTask.finish();
})

PushNotification.configure({

  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function(token) {
      console.log( 'TOKEN:', token );
  },

  // (required) Called when a remote or local notification is opened or received
  onNotification: function(notification) {
      console.log( 'NOTIFICATION:', notification );

      // process the notification

      // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
      notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
  //senderID: "YOUR GCM SENDER ID",

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
      alert: true,
      badge: true,
      sound: true
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
    * (optional) default: true
    * - Specified if permissions (ios) and token (android and ios) will requested or not,
    * - if not, you must call PushNotificationsHandler.requestPermissions() later
    */
  requestPermissions: true,
});


export default class AlarmssScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      first: false,
      stuff: 'no',
      userSettings: {
        defaultPrepTime: 0,
        defaultPostTime: 0,
        defaultSnoozes: 0,
      },
      alarms: [],
    };
    this.renderItem = this.renderItem.bind(this);
    this._toAddScreen = this._toAddScreen.bind(this);
    this.editScreen = this.editScreen.bind(this);
    // this._onRefresh = this._onRefresh.bind(this);
    this._updateUserSettings = this._updateUserSettings.bind(this);
    this.deleteAlarm = this.deleteAlarm.bind(this);
  }


  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      title: 'Alarms',
      headerLeft: (
        <HeaderButton
          IconComponent={Icon}
          iconSize={23}
          color="black"
          >
          <HeaderButton.Item
            iconName={"md-settings"}
            title="Settings"
            onPress={params.goToSettings}
          />
        </HeaderButton>
      ),
      headerRight: (
        <HeaderButton
          IconComponent={Icon}
          iconSize={23}
          color="black"
          >
          <HeaderButton.Item
            iconName={"md-add"}
            title="Add Alarm"
            onPress={params.toAddScreen}
          />
        </HeaderButton>
      ),
    }
  }

  componentWillMount() {

    this.props.navigation.setParams({
      toAddScreen: this._toAddScreen,
      goToSettings: () => this.props.navigation.navigate('SettingsScreen', {
        userId: this.state.userId,
        userSettings: this.state.userSettings,
        updateUserSettings: this._updateUserSettings,
      })
    })

  }

  componentDidMount() {

    // PushNotification.localNotification({

    //   /* iOS and Android properties */
    //   title: "My Notification Title", // (optional)
    //   message: "My Notification Message", // (required)
    //   soundName: 'sound.wav', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
    // });

    PushNotification.localNotificationSchedule({
      message: "My Notification Message", // (required)
      date: new Date(Date.now() + (10 * 1000)), // in 60 secs
      playSound: false,
      soundName: 'annoying.mp3',
    });


    // RNCalendarEvents.authorizationStatus().then(status => {
    //   console.warn('status, ', status);
    //   if(status === 'undetermined') {
    //     RNCalendarEvents.authorizeEventStore()
    //     .then((out) => {
    //       if(out == 'authorized') {
    //         console.warn('out, ', out);
    //       }
    //     })
    //   }
    // })
    // RNCalendarEvents.authorizeEventStore().then(() => {
      // RNCalendarEvents.saveEvent('test', {
      //   startDate: '2018-03-20T19:55:00.000Z',
      //   endDate: '2018-03-20T20:26:00.000Z',
      //   alarms: [{
      //     date: 0 // or absolute date - iOS Only
      //   }]
      // }).then(s => console.warn('warn, ',s));
    // });

    BackgroundTask.schedule();
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
              userSettings: this.state.userSettings,
              updateUserSettings: this._updateUserSettings,
            });
          });
        });
      } else {
        store.get('userSettings').then((settings) => {
          console.log(settings);
          this.setState({
            userId: id,
            userSettings: settings
          })
        }).then(() => {
          store.get('alarms').then(alarms => {
            console.log(alarms);
            this.setState({
              alarms: Object.keys(alarms).map(k => {
                alarms[k].id = k;
                return alarms[k];
              }),
            });
          });
        })
      }
    });
  }

  _toAddScreen() {
    axios.get('http://localhost:8082/commutetime', {
      params: {
        userId: this.state.userId
      }
    })
    .then((alarmCommuteData) => {
      this.setState({
        alarmCommuteData: alarmCommuteData
      });
    }).catch((err) => {
      console.log('?????????',err);
    })
    this.props.navigation.navigate('AddScreen', {
      m: 'l',
      userId: this.state.userId,
      settings: this.state.userSettings,
    })
  }

  editScreen(item) {
    this.props.navigation.navigate('AddScreen', {
      data: item,
      userId: this.state.userId,
    })
  }

  deleteAlarm(item) {
    store.get('alarms').then(alarms => {
      delete alarms[item.id];
      this.setState({
        alarms: Object.keys(alarms).map(k => {
          alarms[k].id = k;
          return alarms[k];
        }),
      });
      store.save('alarms',alarms);
    });
    axios.post('http://localhost:8082/alarm/delete', {
      alarmId: item.id,
      userId: this.state.userId,
    });
  }

  renderItem({ item, index }) {
    let swipeBtns = [{
      text: 'Delete',
      backgroundColor: 'red',
      //underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
      onPress: () => { this.deleteAlarm(item) }
    }];

    return (
      <Swipeout right={swipeBtns}
        autoClose={true}
        backgroundColor="transparent"
      >
        <View style={{ height: 50 }}>
          <TouchableHighlight underlayColor="lightblue" onPress = {() => this.editScreen(item)}>
            <View>
              <FontAwesome style={styles.itemImage}>{Icons.clockO}</FontAwesome>
              <View style={styles.itemMeta}>
                <Text style={styles.itemName}>{item.label}</Text>
                <Text style={styles.itemTime}>{item.time}</Text>
                <Text style={styles.itemLocation}>{item.location}</Text>
              </View>
            </View>
          </TouchableHighlight>
        </View>
      </Swipeout>
    )
  }

  // _onRefresh() {
  //   this.setState({
  //     refreshing: true
  //   })
  //   setTimeout(function() {
  //     this.setState({
  //       refreshing: false
  //     })
  //   }.bind(this),1000)
  // }

  _updateUserSettings(prep, post, snooze) {
    this.setState({
      userSettings: {
        defaultPrepTime: prep,
        defaultPostTime: post,
        defaultSnoozes: snooze,
      }
    })
  }
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between'}}>
        <View style={{ height: '100%', width: '90%' }}>
          <FlatList
            data={this.state.alarms}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            //ListHeaderComponent={() => <Text style={styles.headerText}>Alarms</Text>}
          />
        </View>
      </View>
    );
  }
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 20,
    },
    itemBlock: {
      flexDirection: 'row',
      paddingBottom: 10,
    },
    itemImage: {
      width: 15,
      height: 15,
      marginTop: 10,
      borderRadius: 0,
    },
    itemMeta: {
      marginLeft: 20,
      marginTop: -20,
      justifyContent: 'center',
    },
    itemName: {
      fontSize: 20,
    },
    itemLocation: {
      fontSize: 12,
      color: "#111",
    },
    itemTime: {
      fontSize: 14,
      color: "#111",
    },
    separator: {
      height: 0.5,
      width: "200%",
      alignSelf: 'center',
      backgroundColor: "#555"
    },
    header: {
      padding: 10,
      alignSelf: 'center'
    },
    headerText: {
      fontSize: 30,
      fontWeight: '900'
    }
  });

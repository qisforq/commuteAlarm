import React from 'react';
import axios from 'axios';
import store from 'react-native-simple-store';
import BackgroundTask from 'react-native-background-task';
import PushNotification from 'react-native-push-notification';
import HeaderButton from 'react-navigation-header-buttons';
import Icon from 'react-native-vector-icons/Ionicons.js';
import Swipeout from 'react-native-swipeout';
import BackgroundGeolocation from "react-native-background-geolocation";
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { Alert, Button, Switch, View, Text, TouchableHighlight, AsyncStorage, Slider, FlatList, StyleSheet, ListItem, RefreshControl, PushNotificationIOS } from 'react-native';
import BottomNavigation from './BottomNavigation';
import dummyData from '../../server/dummyData';
import serverCalls from '../serverCalls';


BackgroundTask.define(async () => {
  serverCalls.getCommuteData(this.state.userId, this)
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

  onNotification(notification) {
    console.log( 'NOTIFICATION:', notification);

    if (notification.userInteraction) {
      PushNotification.cancelLocalNotifications({ id: notification.data.id });
    }
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  popInitialNotification: true,

  requestPermissions: true,
});


export default class AlarmssScreen extends React.Component {

  static navigationOptions({ navigation }) {
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

  constructor(props) {
    super(props);
    this.state = {
      userId: null,
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
    this._updateUserSettings = this._updateUserSettings.bind(this);
    this.deleteAlarm = this.deleteAlarm.bind(this);
  }

  componentWillMount() {
    this.props.navigation.setParams({
      toAddScreen: this._toAddScreen,
      goToSettings: () => this.props.navigation.navigate('SettingsScreen', {
        userId: this.state.userId,
        userSettings: this.state.userSettings,
        updateUserSettings: this._updateUserSettings,
      }),
    });

    BackgroundGeolocation.ready({
      // Geolocation Config
      desiredAccuracy: 0,
      distanceFilter: 15,
      // Activity Recognition
      stopTimeout: 2,
      // Application config
      debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true, // <-- Auto start tracking when device is powered-up.
    }, (state) => {
      console.log('- BackgroundGeolocation is configured and ready: ', state.enabled);

      if (!state.enabled) {
        // Start tracking!
        BackgroundGeolocation.start(() => {
          serverCalls.getCommuteData(this.state.userId, this);
          console.log('- Start success');
        });
      }
    });
  }

  componentDidMount() {

    // PushNotification.localNotification({

    //   /* iOS and Android properties */
    //   title: "My Notification Title", // (optional)
    //   message: "My Notification Message", // (required)
    //   soundName: 'sound.wav', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
    // });


    BackgroundTask.schedule();
    store.get('userId').then((id) => {
      if (id === null) {
        axios.get('http://localhost:8082/user/new').then((data) => {
          store.save('userId', data.data);
          store.save('alarms', {});
          store.save('userSettings', {
            defaultPrepTime: 0,
            defaultPostTime: 0,
            defaultSnoozes: 0,
          });
          this.setState({
            userId: data.data,
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
            userSettings: settings,
          });
        }).then(() => {
          store.get('alarms').then((alarms) => {
            console.log(alarms);
            this.setState({
              alarms: Object.keys(alarms).map((k) => {
                alarms[k].id = k;
                return alarms[k];
              }),
            });
          });
        })
      }
    });
  }

  componentWillUnmount() {
    BackgroundGeolocation.removeListeners();
  }

  _toAddScreen() {
    serverCalls.getCommuteData(this.state.userId, this); 
    this.props.navigation.navigate('AddScreen', {
      m: 'l',
      userId: this.state.userId,
      settings: this.state.userSettings,
    })
  }

  _updateUserSettings(prep, post, snooze) {
    this.setState({
      userSettings: {
        defaultPrepTime: prep,
        defaultPostTime: post,
        defaultSnoozes: snooze,
      }
    })
  }

  editScreen(item) {
    console.log(item);
    this.props.navigation.navigate('AddScreen', {
      data: item,
      userId: this.state.userId,
    });
  }

  deleteAlarm(item) {
    store.get('alarms').then((alarms) => {
      delete alarms[item.id];
      this.setState({
        alarms: Object.keys(alarms).map((k) => {
          alarms[k].id = k;
          return alarms[k];
        }),
      });
      store.save('alarms', alarms);
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
      onPress: () => { this.deleteAlarm(item); },
    }];

    return (
      <Swipeout
        right={swipeBtns}
        backgroundColor="transparent"
      >
        <View style={{ height: 60, borderWidth: 0.3, borderColor: 'black' }}>
          <TouchableHighlight underlayColor="lightblue" onPress={() => this.editScreen(item)}>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <View style={{ flex: 0.5 }} />
              <FontAwesome style={{ flex: 2, marginTop: 10, fontSize: 35 }}>{Icons.clockO}</FontAwesome>
              <View style={{ flex: 10 }}>
                <Text style={{ fontWeight: '800', fontSize: 16 }}>{item.label}</Text>
                <Text style={{}}>{new Date(item.time).toDateString()}</Text>
                <Text style={{}}>{new Date(item.time).toLocaleTimeString()}<Text style={{ fontWeight: '300', fontSize: 10 }}>-{item.address.slice(0, 32)}</Text></Text>
                <Text style={{}}>{item.location}</Text>
              </View>
              <Switch
                style={{ flex: 2, marginTop: 10 }}
                tintColor="lightgrey"
                value={item.onOff}
                onValueChange={() => {
                  store.get('alarms').then((alarms) => {
                    alarms[item.id].onOff = !alarms[item.id].onOff;
                    store.save('alarms', alarms);
                  });
                  item.onOff = !item.onOff;
                  let {
                    label, time, prepTime, postTime, locationId, address, onOff
                  } = item;
                  console.log(onOff);
                  axios.post('http://localhost:8082/alarm/edit', {
                    userId: this.state.userId,
                    alarmId: item.id,
                    label,
                    time,
                    prepTime,
                    postTime,
                    locationId,
                    address,
                    onOff,
                  });
                  if (onOff) {
                    axios.post('http://localhost:8082/commutetime/single', {
                      userId: this.state.userId,
                      alarmId: item.id,
                    }).then((res) => {
                      console.log("rory alarma", res.data);
                      console.warn("START ADDRESS:", res.data.commuteData.routes[0].legs[0].start_address)
                      console.log(new Date(item.time - res.data.commuteData.routes[0].legs[0].duration.value*1000));
                      for (let i = 0; i < 5; i += 1) {
                        PushNotification.localNotificationSchedule({
                          message: item.label,
                          date: new Date(item.time - res.data.commuteData.routes[0].legs[0].duration.value*1000 + 1000*10*i),
                          userInfo: {
                           id: item.id,
                          },
                        });
                      }
                    });
                  } else {
                    console.log('cancel');
                    PushNotification.cancelLocalNotifications({ id: item.id });
                  }
                  let alrm = this.state.alarms.slice();
                  alrm[index].onOff = item.onOff;
                  this.setState({
                    alarms: alrm,
                  });
                }}
              />
              <View style={{ flex: 0.5 }}></View>
            </View>
          </TouchableHighlight>
        </View>
      </Swipeout>
    )
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between'}}>
        <View style={{ height: '100%', width: '100%' }}>
          <FlatList
            data={this.state.alarms}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
            //ItemSeparatorComponent={() => <View style={styles.separator} />}
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
      width: "95%",
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

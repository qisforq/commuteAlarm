import React from 'react';
import axios from 'axios';
import store from 'react-native-simple-store';
import BackgroundTask from 'react-native-background-task';
import PushNotification from 'react-native-push-notification';
import HeaderButton from 'react-navigation-header-buttons';
import Icon from 'react-native-vector-icons/Ionicons.js';
import BackgroundGeolocation from "react-native-background-geolocation";
import { View, PushNotificationIOS, Alert, StatusBar } from 'react-native';
import Geocoder from 'react-native-geocoding';
import dummyData from '../../server/dummyData';
import AlarmsList from './AlarmsList';
import { getCommuteData } from '../commuteWorkers';
import { geoConfig, geoSuccess } from '../geoWorker';
import { updateAlarms, switchChange } from '../alarmsListFunctions';
import Sound from 'react-native-sound'

// BackgroundTask.define(async () => {
//   // getCommuteData(this.state, 'commutetime', null, this.modifyAlarms, updateAlarms);
//   BackgroundTask.finish();
// });

Geocoder.setApiKey('AIzaSyAZkNBg_R40VwsvNRmqdGe7WdhkLVyuOaw');

PushNotification.configure({

  onNotification(notification) {
    console.log( 'NOTIFICATION:', notification);

    if (notification.userInteraction) {
      updateAlarms(notification.data.id, false, '', this.modAlarms, false);
      BackgroundGeolocation.getCurrentPosition((location) => {
        BackgroundGeolocation.addGeofence({
          identifier: 'Start',
          radius: 150,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          notifyOnEntry: false,
          notifyOnExit: true,
          notifyOnDwell: true,
          loiteringDelay: 30000,  // 30 seconds
          extras: {               // Optional arbitrary meta-data
            alarmId: notification.data.id,
          },
        }, () => {
        }, (error) => {
          console.warn('Failed to add geofence', error);
        });
      });
      store.get('alarms').then((alarms) => {
        Geocoder.getFromLocation(alarms[notification.data.id].address).then((json) => {
          let { location } = json.results[0].geometry;
          BackgroundGeolocation.addGeofence({
            identifier: 'End',
            radius: 150,
            latitude: location.lat,
            longitude: location.lng,
            notifyOnEntry: true,
            notifyOnExit: false,
            notifyOnDwell: false,
            loiteringDelay: 30000,  // 30 seconds
            extras: {               // Optional arbitrary meta-data
              alarmId: notification.data.id,
            },
          }, () => {
          }, (error) => {
            console.warn('Failed to add geofence', error);
          });
        });
        alarms[notification.data.id].turnedOff = true;
        store.save('alarms', alarms);
      });
      // This is to remove all past notifications from the notifications screen.
      PushNotificationIOS.removeAllDeliveredNotifications();
    } else if (Date.parse(notification.data.alarmTime) > (Date.now() - 100)) {
      Sound.setCategory('Playback');

      store.get('userSettings').then((userSettings) => {
        let whoosh = new Sound(`${userSettings.defaultAlarmSound}.mp3`, Sound.MAIN_BUNDLE, (err) => {
          if (err) throw err;
          whoosh.play();
        });
        Alert.alert(notification.alert, '', [
          {
            text: 'Turn Off',
            onPress: () => {

              store.get('alarms').then((alarmsObj) => {
                let { alarmData, userId, userSettings, alarmTime } = notification.data
                // switchChange(alarmData, userId, userSettings, this.modAlarms, alarmTime)
                updateAlarms(notification.data.id, false, '', this.modAlarms, false);
                whoosh.release();

                alarmsObj[alarmData.id].turnedOff = true;
                store.save('alarms', alarmsObj);
              })
            }
          },
          // {text: 'Snooze', onPress: () => whoosh.release()},
        ]);
      });
    }
    PushNotification.cancelLocalNotifications({ id: notification.data.id });
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


export default class AlarmsScreen extends React.Component {

  static navigationOptions({ navigation }) {
    const params = navigation.state.params || {};

    return {
      title: 'Alarms',
      headerLeft: (
        <HeaderButton
          IconComponent={Icon}
          iconSize={23}
          color="#f5f5f5"
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
          color="#f5f5f5"
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
        defaultSnoozeTime: 8,
      },
      alarms: [],
      favPlaces: [],
    };
    this._toAddScreen = this._toAddScreen.bind(this);
    this.editScreen = this.editScreen.bind(this);
    this._updateUserSettings = this._updateUserSettings.bind(this);
    this.deleteAlarm = this.deleteAlarm.bind(this);
    this.modifyAlarms = this.modifyAlarms.bind(this);
    this.commuteData = this.commuteData.bind(this);
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

    BackgroundGeolocation.on('heartbeat', ({ location }) => {
      getCommuteData(this.state, 'commutetime', null, this.modifyAlarms, updateAlarms, location);
      axios.post('http://roryeagan.com:8082/user/geolocation', {
        location,
        userId: this.state.userId,
      }).catch(console.log('Error saving geolocation to DB'))
    });

    BackgroundGeolocation.on('geofence', (geofence) => {
      const { alarmId, identifier } = geofence.extras;
      store.get('alarms').then((alarms) => {
        if (identifier === 'Start') {
          alarms[alarmId].commuteStart = Date.getTime();
        } else if (identifier === 'End') {
          alarms[alarmId].commuteEnd = Date.getTime();
        }
        if (alarms[alarmId].commuteStart && alarms[alarmId].commuteEnd) {
          let start = alarms[alarmId].commuteStart;
          let end = alarms[alarmId].commuteEnd;
          store.get('travel').then((travel) => {
            travel.push(((end - start) - alarms[alarmId].commuteTime) / alarms[alarmId].commuteTime);
            store.save('travel', travel);
          });
          alarms[alarmId].commuteStart = 0;
          alarms[alarmId].commuteEnd = 0;
        }
        alarms[alarmId].id = alarmId;
        store.save('alarms', alarms);
      });
    });

    // BackgroundGeolocation.on("location", (location) => {
    //   console.log(location);
    //   //getCommuteData(this.state, 'commutetime', null, this.modifyAlarms, updateAlarms, location);
    // });

    BackgroundGeolocation.ready(geoConfig, (state) => {
      if (!state.enabled) {
        // Start tracking!
        BackgroundGeolocation.start();
      }
    });
  }

  componentDidMount() {
    PushNotification.modAlarms = this.modifyAlarms;
    // BackgroundTask.schedule();
    store.get('userId').then((id) => {
      if (id === null) {
        axios.get('http://roryeagan.com:8082/user/new').then((data) => {
          store.save('userId', data.data);
          store.save('alarms', {});
          store.save('travel', []);
          store.save('places', {});
          store.save('events', {});
          store.save('userSettings', {
            defaultPrepTime: 0,
            defaultPostTime: 0,
            defaultSnoozes: 0,
            defaultSnoozeTime: 8,
            defaultAlarmSound: 'annoying',
          }).then(() => {
            this.setState({
              userId: data.data,
              userSettings: {
                defaultPrepTime: 0,
                defaultPostTime: 0,
                defaultSnoozes: 0,
                defaultSnoozeTime: 8,
                defaultAlarmSound: 'annoying',
              },
            }, () => {
              this.props.navigation.navigate('SettingsScreen', {
                userId: this.state.userId,
                userSettings: this.state.userSettings,
                updateUserSettings: this._updateUserSettings,
              });
            });
          });
        });
      } else {
        store.get('userSettings').then((settings) => {
          this.setState({
            userId: id,
            userSettings: settings,
          });
        }).then(() => {
          store.get('alarms').then((alarms) => {
            this.setState({
              alarms: Object.keys(alarms).map((k) => {
                alarms[k].id = k;
                return alarms[k];
              }),
            });
          });
        });
        store.get('places').then((places) => {
          let favPlaces = Object.entries(places).sort((a, b) => a[1].count < b[1].count);
          favPlaces = favPlaces.map(p => ({ description: p[1].address, place_id: p[0] })).slice(0,2);
          this.setState({
            favPlaces,
          });
        });
      }
    });
  }

  componentWillUnmount() {
    BackgroundGeolocation.removeListeners();
  }

  commuteData(url, item, edit) {
    BackgroundGeolocation.getCurrentPosition((location) => {
      getCommuteData(this.state, url, item, this.modifyAlarms, updateAlarms, location, edit);
    });
  }

  _toAddScreen() {
    // getCommuteData(this.state, 'commutetime', null, this.modifyAlarms, updateAlarms);
    console.log(this.state.userSettings);
    this.props.navigation.navigate('AddScreen', {
      userId: this.state.userId,
      settings: this.state.userSettings,
      favPlaces: this.state.favPlaces,
    });
  }

  _updateUserSettings(prep, post, snooze, snoozeTime, alarmSound) {
    this.setState({
      userSettings: {
        defaultPrepTime: prep,
        defaultPostTime: post,
        defaultSnoozes: snooze,
        defaultSnoozeTime: snoozeTime,
        defaultAlarmSound: alarmSound,
      },
    });
  }

  editScreen(item) {
    this.props.navigation.navigate('AddScreen', {
      data: item,
      userId: this.state.userId,
      commuteData: this.commuteData,
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
    axios.post('http://locahost:8082/alarm/delete', {
      alarmId: item.id,
      userId: this.state.userId,
    });
  }

  modifyAlarms(alarms, edit) {
    console.log(alarms);
    this.setState({
      alarms,
    }, () => {
      if (edit) {
        this.props.navigation.navigate('AlarmsScreen');
      }
    });
  }

  render() {
    return (
          <AlarmsList
            userId={this.state.userId}
            userSettings={this.state.userSettings}
            alarms={this.state.alarms}
            modifyAlarms={this.modifyAlarms}
            deleteAlarm={this.deleteAlarm}
            editScreen={this.editScreen}
          />
    );
  }
}

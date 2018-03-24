import React from 'react';
import axios from 'axios';
import store from 'react-native-simple-store';
import BackgroundTask from 'react-native-background-task';
import PushNotification from 'react-native-push-notification';
import HeaderButton from 'react-navigation-header-buttons';
import Icon from 'react-native-vector-icons/Ionicons.js';
import BackgroundGeolocation from "react-native-background-geolocation";
import { PushNotificationIOS } from 'react-native';
import BottomNavigation from './BottomNavigation';
import dummyData from '../../server/dummyData';
import serverCalls from '../serverCalls';
import AlarmsList from './AlarmsList';
import { getCommuteData } from '../commuteWorkers';
import { geoConfig, geoSuccess } from '../geoWorker'
import { updateAlarms } from '../alarmsListFunctions';


BackgroundTask.define(async () => {
  getCommuteData(this.state, 'commutetime', null, this.modifyAlarms, updateAlarms);
  BackgroundTask.finish();
});

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


export default class AlarmsScreen extends React.Component {

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
        defaultSnoozeTime: 8,
      },
      alarms: [],
    };
    this._toAddScreen = this._toAddScreen.bind(this);
    this.editScreen = this.editScreen.bind(this);
    this._updateUserSettings = this._updateUserSettings.bind(this);
    this.deleteAlarm = this.deleteAlarm.bind(this);
    this.modifyAlarms = this.modifyAlarms.bind(this);
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

    BackgroundGeolocation.ready(geoConfig, (state) => {
      if (!state.enabled) {
        // Start tracking!
        BackgroundGeolocation.start(() => {
            getCommuteData(this.state);
        });
      }
    });
  }

  componentDidMount() {


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
            defaultSnoozeTime: 8,
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
    // BackgroundGeolocation.removeListeners();
  }

  _toAddScreen() {
    getCommuteData(this.state, 'commutetime', null, this.modifyAlarms, updateAlarms);

    this.props.navigation.navigate('AddScreen', {
      m: 'l',
      userId: this.state.userId,
      settings: this.state.userSettings,
    })
  }

  _updateUserSettings(prep, post, snooze, snoozeTime) {
    this.setState({
      userSettings: {
        defaultPrepTime: prep,
        defaultPostTime: post,
        defaultSnoozes: snooze,
        defaultSnoozeTime: snoozeTime,
      },
    });
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

  modifyAlarms(alarms) {
    console.log('modify: ', alarms);
    this.setState({
      alarms,
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

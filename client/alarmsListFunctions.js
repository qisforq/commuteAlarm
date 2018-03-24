import PushNotification from 'react-native-push-notification';
import BackgroundGeolocation from "react-native-background-geolocation";
import axios from 'axios';
import store from 'react-native-simple-store';
import { getCommuteData } from './commuteWorkers';

let alarmsListFunctions = {};

const updateAlarms = (id, onOff, goOffTime, modifyAlarms) => {
  console.log('herer we are', id);
  store.get('alarms').then((alarms) => {
    const newAlarms = Object.keys(alarms).map((k) => {
      if (k === id) {
        alarms[k].onOff = onOff;
        alarms[k].goOffTime = goOffTime;
      }
      alarms[k].id = k;
      return alarms[k];
    });
    modifyAlarms(newAlarms);
    store.save('alarms', alarms);
  });
};

const alarmOn = (item, userId, userSettings, modifyAlarms) => {
  getCommuteData({ userId, userSettings }, 'commutetime/single', item, modifyAlarms, updateAlarms);
};

const switchChange = (item, userId, userSettings, modifyAlarms) => {
  let {
    label, time, prepTime, postTime, locationId, address, onOff, id,
  } = item;
  onOff = !onOff;
  updateAlarms(id, onOff, undefined, modifyAlarms);
  axios.post('http://localhost:8082/alarm/edit', {
    userId,
    alarmId: id,
    label,
    time,
    prepTime,
    postTime,
    locationId,
    address,
    onOff,
  });
  if (onOff) {
    alarmOn(item, userId, userSettings, modifyAlarms);
  } else {
    updateAlarms(id, false, undefined, modifyAlarms);
    PushNotification.cancelLocalNotifications({ id });
  }
};

module.exports = { switchChange, alarmOn, updateAlarms };

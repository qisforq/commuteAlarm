import PushNotification from 'react-native-push-notification';
import BackgroundGeolocation from "react-native-background-geolocation";
import axios from 'axios';
import { Alert } from 'react-native';
import store from 'react-native-simple-store';
import { getCommuteData } from './commuteWorkers';
import { getLocationParams, getLocationErr } from './geoWorker';

let alarmsListFunctions = {};

const updateAlarms = (id, onOff, goOffTime, modifyAlarms, edit) => {
  console.log('herer we are', id, goOffTime, onOff);
  store.get('alarms')
  .then((alarms) => {
    console.log('askdfbakjsdbfasbdfahsdf',alarms);
    const newAlarms = Object.keys(alarms).map((k) => {
      if (k === id) {
        alarms[k].onOff = onOff;
        alarms[k].goOffTime = goOffTime;
      }
      alarms[k].id = k;
      return alarms[k];
    });
    modifyAlarms(newAlarms, edit);
    console.log(alarms);
    store.save('alarms', alarms);
  });
};

const alarmOn = (item, userId, userSettings, modifyAlarms) => {
  BackgroundGeolocation.getCurrentPosition((location) => {
    getCommuteData({ userId, userSettings }, 'commutetime/single', item, modifyAlarms, updateAlarms, location);
  }, getLocationErr, getLocationParams);
};

const switchChange = (item, userId, userSettings, modifyAlarms, notif) => {
  let {
    label, time, prepTime, postTime, locationId, address, onOff, id, travelMethod,
  } = item;

  if (item.time < Date.now()) {
    return setTimeout(() => Alert.alert('This alarm has already passed =\'('), 300);
  }
  store.get('alarms').then((alarmsObj) => {

    if (alarmsObj[id].turnedOff) {
      return setTimeout(() => Alert.alert('This alarm has already passed =\'('), 300);
    }

    onOff = !onOff;
    updateAlarms(id, onOff, undefined, modifyAlarms)
    axios.post('http://roryeagan.com:8082/alarm/edit', {
      userId,
      alarmId: id,
      label,
      time,
      prepTime,
      postTime,
      locationId,
      address,
      onOff,
      travelMethod,
    }).catch((err) => {
      console.log('ERRRRRRRRROR', err);
    });

    if (onOff && !notif) {
      alarmOn(item, userId, userSettings, modifyAlarms);
    } else {
      updateAlarms(id, false, undefined, modifyAlarms);
      PushNotification.cancelLocalNotifications({ id })
    }
  });
};

module.exports = { switchChange, alarmOn, updateAlarms };

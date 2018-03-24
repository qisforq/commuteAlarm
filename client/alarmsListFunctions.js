import PushNotification from 'react-native-push-notification';
import BackgroundGeolocation from "react-native-background-geolocation";
import axios from 'axios';
import store from 'react-native-simple-store';

let alarmsListFunctions = {};

alarmsListFunctions.updateAlarms = (id, onOff, goOffTime, modifyAlarms) => {
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

alarmsListFunctions.alarmOn = (item, userId, userSettings, modifyAlarms) => {
  BackgroundGeolocation.getCurrentPosition((location) => {
    console.log('- Current position received!!!!');
    let { latitude, longitude } = location.coords;
    axios.post('http://localhost:8082/commutetime/single', {
      userId,
      alarmId: item.id,
      GPSLat: latitude,
      GPSLong: longitude,
    }).then((res) => {
      const calcGoOff = item.time - res.data.commuteData.routes[0].legs[0].duration.value*1000 - item.prepTime*5*60*1000 - item.postTime*5*60*1000;
      alarmsListFunctions.updateAlarms(item.id, true, calcGoOff, modifyAlarms);
      console.log(new Date(item.time - res.data.commuteData.routes[0].legs[0].duration.value*1000 - item.prepTime*5*60*1000 - item.postTime*5*60*1000 + 1000*60*userSettings.defaultSnoozeTime*0));
      [...Array(userSettings.defaultSnoozes+1)].forEach((x, i) => {
        PushNotification.localNotificationSchedule({
          message: item.label,
          date: new Date(item.time - res.data.commuteData.routes[0].legs[0].duration.value*1000 - item.prepTime*5*60*1000 - item.postTime*5*60*1000 + 1000*60*userSettings.defaultSnoozeTime*i),
          userInfo: {
            id: item.id,
          },
          soundName: 'annoying.mp3',
        });
      });
    });
  });
};

alarmsListFunctions.switchChange = (item, userId, userSettings, modifyAlarms) => {
  let {
    label, time, prepTime, postTime, locationId, address, onOff, id,
  } = item;
  onOff = !onOff;
  alarmsListFunctions.updateAlarms(id, onOff, undefined, modifyAlarms);
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
    alarmsListFunctions.alarmOn(item, userId, userSettings, modifyAlarms);
  } else {
    alarmsListFunctions.updateAlarms(id, false, undefined, modifyAlarms);
    PushNotification.cancelLocalNotifications({ id });
  }
};

module.exports = alarmsListFunctions;

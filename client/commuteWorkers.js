import axios from 'axios';
import BackgroundGeolocation from 'react-native-background-geolocation';
import PushNotification from 'react-native-push-notification';
import { getLocationErr, getLocationParams } from './geoWorker';

getCommuteData = ({userId, userSettings}, url, item, modifyAlarms, updateAlarms) => {
  BackgroundGeolocation.getCurrentPosition((location) => {
    console.log('- Current position received!!!!');
    let {latitude, longitude} = location.coords;

    axios.get(`http://localhost:8082/${url}`, {
      params: {
        userId,
        alarmId: item ? item.id : null,
        GPSLat: latitude,
        GPSLong: longitude,
      }
    })
    .then(({ data }) => {
      if (!Array.isArray(data)) {
        data = [data];
      }
      console.log(updateAlarms)
      data.forEach((alarm) => {
        console.log(alarm)
        const calcGoOff = alarm.time - alarm.commuteData.routes[0].legs[0].duration.value*1000 - alarm.prepTime*5*60*1000 - alarm.postTime*5*60*1000;
        console.log(calcGoOff)
        updateAlarms(alarm.alarmId, true, calcGoOff, modifyAlarms);
        PushNotification.cancelLocalNotifications({ id: alarm.alarmId });
        [...Array(userSettings.defaultSnoozes+1)].forEach((x, i) => {
          PushNotification.localNotificationSchedule({
            message: alarm.label,
            date: new Date(alarm.time - alarm.commuteData.routes[0].legs[0].duration.value*1000 - alarm.prepTime*5*60*1000 - alarm.postTime*5*60*1000 + 1000*60*userSettings.defaultSnoozeTime*i),
            userInfo: {
              id: alarm.alarmId,
            },
            soundName: 'annoying.mp3',
          });
        });
      });
    }).catch((err) => {
      console.log('Error in axios.get(/commutetime)',err);
    });
  }, getLocationErr, getLocationParams);
}









module.exports = {
  getCommuteData: getCommuteData
}
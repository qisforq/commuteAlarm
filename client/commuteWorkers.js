import axios from 'axios';
import BackgroundGeolocation from 'react-native-background-geolocation';
import PushNotification from 'react-native-push-notification';
import { getLocationErr, getLocationParams, setSchedule } from './geoWorker';
import store from 'react-native-simple-store';

getCommuteData = ({userId, userSettings}, url, item, modifyAlarms, updateAlarms, location) => {
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
    data.forEach((alarm) => {
      const calcGoOff = alarm.time - alarm.commuteData.routes[0].legs[0].duration.value*1000 - alarm.prepTime*5*60*1000 - alarm.postTime*5*60*1000;
      // Q + D new code vvvvv
      // let startTime = endTime - 1*60*60
      const endTime = new Date(calcGoOff);
      const startTime = new Date(calcGoOff - 1 * 60 * 60 * 1000);
      const alarmDay =  endTime.getDay() + 1 + '';
      const scheduleStr = `${alarmDay} ${startTime.toString().slice(16,21)}-${endTime.toString().slice(16, 21)}`;

      store.get('alarms').then((alarmsObj)=>{
        alarmsObj[alarm.alarmId].scheduleStr = scheduleStr || '';
        store.save('alarms', alarmsObj).then(() => updateAlarms(alarm.alarmId, true, calcGoOff, modifyAlarms));
      })
      // schedule.push(scheduleStr);
      // End of Q + D code ^^^^
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

  })
  .then(()=>{
    setSchedule();
  })
  .catch((err) => {
    console.log('Error in axios.get(/commutetime)',err);
  });
}


module.exports = {
  getCommuteData: getCommuteData
}

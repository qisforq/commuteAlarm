import axios from 'axios';
import BackgroundGeolocation from 'react-native-background-geolocation';
import PushNotification from 'react-native-push-notification';
import { getLocationErr, getLocationParams, setSchedule } from './geoWorker';
import store from 'react-native-simple-store';
import { switchChange, alarmOn, updateAlarms } from './alarmsListFunctions';


const getCommuteData = ({ userId, userSettings }, url, item, modifyAlarms, updateAlarms, location, edit) => {
  let { latitude, longitude } = location.coords;
  axios.get(`http://roryeagan.com:8082/${url}`, {
    params: {
      userId,
      alarmId: item ? item.id : null,
      GPSLat: latitude,
      GPSLong: longitude,
    },
  })
    .then(({ data }) => {
      if (!Array.isArray(data)) {
        data = [data];
      }
      store.get('travel').then((travel) => {
        let offSet = travel.length ? travel.reduce((ac, c) => ac + c) / travel.length : 0;
        data.forEach((alarm) => {
          const calcGoOff = alarm.time - (alarm.commuteData.routes[0].legs[0].duration.value*1000) - (alarm.prepTime*5*60*1000) - (alarm.postTime*5*60*1000) - (1000*60*alarm.snoozeTime*alarm.snoozes) - offSet;
          // Q + D new code vvvvv
          // let startTime = endTime - 1*60*60
          const endTime = new Date(calcGoOff + alarm.prepTime*5*60*1000 + 1000*60*20);
          const startTime = new Date(calcGoOff - 1 * 60 * 60 * 1000);
          const alarmDay =  endTime.getDay() + 1 + '';
          const scheduleStr = `${alarmDay} ${startTime.toString().slice(16,21)}-${endTime.toString().slice(16, 21)}`;
          const scheduleStrArrive = `${alarmDay} ${new Date(alarm.time - alarm.commuteData.routes[0].legs[0].duration.value*1000/2).toString().slice(16,21)}-${new Date(alarm.time + alarm.commuteData.routes[0].legs[0].duration.value*1000/2).toString().slice(16, 21)}`;
          store.get('alarms').then((alarmsObj) => {
            alarmsObj[alarm.alarmId].scheduleStr = scheduleStr || '';
            alarmsObj[alarm.alarmId].scheduleStrArrive = scheduleStrArrive || '';
            alarmsObj[alarm.alarmId].commuteTime = alarm.commuteData.routes[0].legs[0].duration.value*1000;
            store.save('alarms', alarmsObj).then(() => updateAlarms(alarm.alarmId, true, calcGoOff, modifyAlarms, edit));
          });
          // schedule.push(scheduleStr);
          // End of Q + D code ^^^^
          PushNotification.cancelLocalNotifications({ id: alarm.alarmId });
          [...Array(alarm.snoozes+1)].forEach((x, i) => {
            const alarmTime = new Date(alarm.time - (alarm.commuteData.routes[0].legs[0].duration.value*1000) - (alarm.prepTime*5*60*1000) - (alarm.postTime*5*60*1000) - (1000*60*alarm.snoozeTime*alarm.snoozes) - offSet + (1000*60*alarm.snoozeTime*i));

            if (alarm.time > Date.now()) {
              PushNotification.localNotificationSchedule({
                message: alarm.label,
                date: alarmTime,
                userInfo: {
                  id: alarm.alarmId,
                  userId,
                  userSettings,
                  alarmData: alarm,
                  alarmTime,
                },
                soundName: `${alarm.alarmSound}.mp3`,
              });
              if (i === alarm.snoozes) {
                for (let j = 1; j < 60; j+=1) {
                  const extraAlarm = new Date(alarmTime.getTime() + (j*60*1000));
                  PushNotification.localNotificationSchedule({
                    message: alarm.label,
                    date: extraAlarm,
                    userInfo: {
                      id: alarm.alarmId,
                      userId,
                      userSettings,
                      alarmData: alarm,
                      alarmTime,
                    },
                    soundName: `${alarm.alarmSound}.mp3`,
                  });
                }
              }
            }
          });
        });
      });
    })
    .then(() => {
      setSchedule();
    })
    .catch((err) => {
      console.log('Error in axios.get(/commutetime)', err);
    });
};

module.exports = {
  getCommuteData,
};

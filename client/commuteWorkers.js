import axios from 'axios';
import BackgroundGeolocation from 'react-native-background-geolocation';
import PushNotification from 'react-native-push-notification';
import {getLocation} from '../geoWorker';

getCommuteData = ({userId, userSettings}) => {
    console.warn('userId', userId,'userSettings:', userSettings)
    BackgroundGeolocation.getCurrentPosition((location) => {
        console.log('- Current position received!!!!');
        let {latitude, longitude} = location.coords;

        axios.get('http://localhost:8082/commutetime', {
        params: {
            userId: userId,
            GPSLat: latitude,
            GPSLong: longitude,
        }
        })
        .then((alarmCommuteData) => {
            alarmCommuteData.data.forEach((alarm) => {
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
    }, (errorCode) => {
        switch (errorCode) {
        case 0:
            alert('Failed to retrieve location');
            break;
        case 1:
            alert('You must enable location services in Settings');
            break;
        case 2:
            alert('Network error');
            break;
        case 408:
            alert('Location timeout');
            break;
        default:
            break;
        }
    }, {
        timeout: 30,      // 30 second timeout to fetch location
        persist: false,
        maximumAge: 5000, // Accept the last-known-location if not older than 5000 ms.
        desiredAccuracy: 10,  // Try to fetch a location with an accuracy of `10` meters.
        samples: 3,   // How many location samples to attempt.
    });
}









module.exports = {
    getCommuteData: getCommuteData
}
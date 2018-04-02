const axios = require('axios');
const config = require('./config.js');

exports.getCommuteTime = (alarm, GPSLat, GPSLong) => {
  let {
    alarmId, label, location, onOff, postTime, prepTime, snoozes, snoozeTime, alarmSound, time, travelMethod,
  } = alarm;
  const rootURL = 'https://maps.googleapis.com/maps/api/directions/json?';

  let unixEpochTime = (time.toString()).slice(0, 10);

  let testOrigin = 'ChIJJWgxqOZawokRxM8nq5RnA7g';
  //  TODO: Access phone's current location for this!
  console.log(travelMethod.toLowerCase());
  const commuteURL = [
    rootURL,
    `origin=${GPSLat},${GPSLong}`,
    `&destination=place_id:${location}`,
    `&key=${config.googleMapsAPI}`,
    `&arrival_time=${unixEpochTime}`,
    `&mode=${travelMethod.toLowerCase()}`,
  ].join('');
  console.log('commuteURL', commuteURL);
  return axios.get(commuteURL).then(data => (
    {
      alarmId,
      time,
      label,
      postTime,
      prepTime,
      snoozes,
      snoozeTime,
      alarmSound,
      commuteData: data.data,
    })).catch(err => console.log('error in getCommuteTime (server/apiHelpers.js) with this alarm:', alarm));
};

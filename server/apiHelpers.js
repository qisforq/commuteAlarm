const axios = require('axios')
const config = require('./config.js');

exports.getCommuteTime = (alarm) => {
  let {alarmId, label, location, on, postTime, prepTime, time} = alarm
  const rootURL = 'https://maps.googleapis.com/maps/api/directions/json?';

  let unixEpochTime = (time + '').slice(0,10)

  let testOrigin = `ChIJJWgxqOZawokRxM8nq5RnA7g` //TODO: Access phone's current location for this!
  const commuteURL = [
    rootURL,
    `origin=place_id:${testOrigin}`,
    `&destination=place_id:${location}`,
    `&key=${config.googleMapsAPI}`,
    `&arrival_time=${unixEpochTime}`,
    `&mode="transit"`
  ].join('')

  return axios.get(commuteURL).then((data) => {
    // return data.data.routes
    return {alarmId: alarmId, commuteData: data.data}
  }).catch(err => console.log("error in getCommuteTime (server/apiHelpers.js) with this alarm:", alarm));
}


var firebase = require('./config').firebase;

var usersRef = firebase.database().ref('users/');

var firebaseMethods = {};

firebaseMethods.newUser = function(cb) {
  console.log('herer we are');
    cb(usersRef.push({
      userSettings: {
        defaultPrepTime: 0,
        defaultPostTime: 0,
        defaultSnoozes: 0,
      },
      alarms: {
        alarm1: {
          label: "work",
          time: 1521472080122,
          preptime: 20,
          postTime: 15,
          on: true,
          location: "ChIJs980r6hZwokRJrYJwpNFwPE"
        },
      }
    }).key);
}

firebaseMethods.newAlarm = function(data, cb) {
  cb(firebase.database().ref(`users/${data.userId}/alarms`).push({
    label: data.label,
    time: data.time,
    prepTime: data.prepTime,
    postTime: data.postTime,
    on: false,
    location: data.locationId,
  }).key);
}

firebaseMethods.saveSettings = function(settings, cb) {
  cb(firebase.database().ref(`users/${settings.userId}/userSettings`).push({
    defaultPrepTime: settings.prepTime,
    defaultPostTime: settings.postTime,
    defaultSnoozes: settings.snoozes,
  }).key);
}

firebaseMethods.seed1 =  function() {
 usersRef.push({
   userSettings: {
     snoozes: 0,
     prepTime: 0,
     postTime: 0
   },
  alarms: {
    alarm1: {
      label: "work",
      time: 1521472080122,
      preptime: 20,
      on: true,
      location: "ChIJs980r6hZwokRJrYJwpNFwPE"
    },
    alarm2: {
      label: "bed",
      time: 1521472080122,
      preptime: 20,
      on: true,
      location: "ChIJs980r6hZwokRJrYJwpNFwPE"
    }

  }
})
}


module.exports = firebaseMethods;

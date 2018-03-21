
var firebase = require('./config').firebase;

var usersRef = firebase.database().ref('users/');
const getCommuteTime = require('./apiHelpers').getCommuteTime;

var firebaseMethods = {};

firebaseMethods.newUser = function(cb) {
    cb(usersRef.push({
      userSettings: {
        defaultPrepTime: 0,
        defaultPostTime: 0,
        defaultSnoozes: 0,
      },
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
    address: data.address,
  }).key);
}

firebaseMethods.editAlarm = function(data, cb) {
  console.log("daaaatatatatattaaa, ",data);
  cb(firebase.database().ref(`users/${data.userId}/alarms/${data.alarmId}`).update({
    label: data.label,
    time: data.time,
    prepTime: data.prepTime,
    postTime: data.postTime,
    on: data.onOff,
    location: data.locationId,
    address: data.address,
  }).key);
}

firebaseMethods.deleteAlarm = function(data, cb) {
  firebase.database().ref(`users/${data.userId}/alarms/${data.alarmId}`).remove();
}

firebaseMethods.getAlarms = function({userId}, cb) {
  firebase.database().ref(`users/${userId}/alarms`).on('value', (snapshot) => {
    let snapshots = []

    snapshot.forEach((child) => {
      let alarmObj = Object.assign({}, {alarmId: child.key}, child.val())
      snapshots.push(alarmObj)
    })

    Promise.all(snapshots.map(snap => getCommuteTime(snap)))
    .then((alarmCommuteData) => {
      cb(alarmCommuteData)
    }).catch((err) => {
      console.log('Error inside the Promise.all function within editAlarm (server/database.js line 64)');
    })
  })
}

firebaseMethods.saveSettings = function(settings, cb) {
  cb(firebase.database().ref(`users/${settings.userId}/userSettings`).set({
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

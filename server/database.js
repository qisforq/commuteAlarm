
const { firebase } = require('./config');
const { getCommuteTime } = require('./apiHelpers');

const usersRef = firebase.database().ref('users/');

let firebaseMethods = {};

firebaseMethods.newUser = function (cb) {
  cb(usersRef.push({
    userSettings: {
      defaultPrepTime: 0,
      defaultPostTime: 0,
      defaultSnoozes: 0,
    },
  }).key);
};

firebaseMethods.newAlarm = function (data, cb) {
  cb(firebase.database().ref(`users/${data.userId}/alarms`).push({
    label: data.label,
    time: data.time,
    prepTime: data.prepTime,
    postTime: data.postTime,
    onOff: false,
    location: data.locationId,
  }).key);
};

firebaseMethods.editAlarm = function (data, cb) {
  cb(firebase.database().ref(`users/${data.userId}/alarms/${data.alarmId}`).update({
    label: data.label,
    time: data.time,
    prepTime: data.prepTime,
    postTime: data.postTime,
    onOff: data.onOff,
    location: data.locationId,
  }).key);
};

firebaseMethods.deleteAlarm = function (data) {
  firebase.database().ref(`users/${data.userId}/alarms/${data.alarmId}`).remove();
};

firebaseMethods.getAlarms = function ({ userId, GPSLat, GPSLong }, cb) {
  firebase.database().ref(`users/${userId}/alarms/`).on('value', (snapshot) => {
    const snapshots = [];

    snapshot.forEach((child) => {
      let alarmObj = Object.assign({}, { alarmId: child.key }, child.val())
      if (alarmObj.onOff) {
        snapshots.push(alarmObj);
        console.log(alarmObj.label, 'alarm is turned on');
      } else {
        console.log(alarmObj.label, 'alarm is turned off');
      }

    });

    Promise.all(snapshots.map(snap => getCommuteTime(snap, GPSLat, GPSLong)))
      .then((alarmCommuteData) => {
        cb(alarmCommuteData);
      }).catch((err) => {
      });
  });
};

firebaseMethods.getAlarm = function ({ userId, alarmId }, cb) {
  firebase.database().ref(`users/${userId}/alarms/${alarmId}`).once('value').then((snapshot) => {
    console.log('snnapshot value :', snapshot.val());
    getCommuteTime(snapshot.val()).then(result => cb(result));
  });
};

firebaseMethods.saveSettings = function (settings, cb) {
  cb(firebase.database().ref(`users/${settings.userId}/userSettings`).set({
    defaultPrepTime: settings.prepTime,
    defaultPostTime: settings.postTime,
    defaultSnoozes: settings.snoozes,
  }).key);
};

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
      onOff: true,
      location: "ChIJs980r6hZwokRJrYJwpNFwPE"
    },
    alarm2: {
      label: "bed",
      time: 1521472080122,
      preptime: 20,
      onOff: true,
      location: "ChIJs980r6hZwokRJrYJwpNFwPE"
    }

  }
})
}


module.exports = firebaseMethods;

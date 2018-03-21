
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
    on: false,
    location: data.locationId,
  }).key);
};

firebaseMethods.editAlarm = function (data, cb) {
  cb(firebase.database().ref(`users/${data.userId}/alarms/${data.alarmId}`).update({
    label: data.label,
    time: data.time,
    prepTime: data.prepTime,
    postTime: data.postTime,
    on: false,
    location: data.locationId,
  }).key);
};

firebaseMethods.deleteAlarm = function (data) {
  firebase.database().ref(`users/${data.userId}/alarms/${data.alarmId}`).remove();
};

firebaseMethods.getAlarms = function ({ userId }, cb) {
  firebase.database().ref(`users/${userId}/alarms`).on('value', (snapshot) => {
    let snapshots = [];
    //  change to const

    snapshot.forEach((child) => {
      let alarmObj = Object.assign({}, { alarmId: child.key }, child.val())
      snapshots.push(alarmObj);
    });

    Promise.all(snapshots.map(snap => getCommuteTime(snap)))
      .then((alarmCommuteData) => {
        cb(alarmCommuteData);
      }).catch((err) => {
      });
  });
};

firebaseMethods.saveSettings = function (settings, cb) {
  cb(firebase.database().ref(`users/${settings.userId}/userSettings`).set({
    defaultPrepTime: settings.prepTime,
    defaultPostTime: settings.postTime,
    defaultSnoozes: settings.snoozes,
  }).key);
};

firebaseMethods.seed1 = function () {
  usersRef.push({
    userSettings: {
      snoozes: 0,
      prepTime: 0,
      postTime: 0,
    },
    alarms: {
      alarm1: {
        label: 'work',
        time: 1521472080122,
        preptime: 20,
        on: true,
        location: 'ChIJs980r6hZwokRJrYJwpNFwPE',
      },
      alarm2: {
        label: 'bed',
        time: 1521472080122,
        preptime: 20,
        on: true,
        location: 'ChIJs980r6hZwokRJrYJwpNFwPE',
      },
    },
  });
};


module.exports = firebaseMethods;

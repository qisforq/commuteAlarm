
const { firebase } = require('./config');
const { getCommuteTime } = require('./apiHelpers');

const usersRef = firebase.database().ref('users/');
const tokensRef = firebase.database().ref('tokens/');
const calendarRef = firebase.database().ref('calendars/');

let firebaseMethods = {};

firebaseMethods.storeCalendar = function (item) {
  calendarRef.push({
    calendar: {
      events: item
    }
  }).key
}

firebaseMethods.storeToken = function (accessToken, refreshToken, id) {
  console.log("here", accessToken, refreshToken, id)
  firebase.database().ref(`users/${id}/token`).set({
    accessToken,

  }).key
}

firebaseMethods.getToken = function(id) {
  return firebase.database().ref(`users/${id}/token`).once('value').then((snapshot) => {
    return snapshot.val();
  });
}

firebaseMethods.newUser = function (cb) {
  cb(usersRef.push({
    userSettings: {
      defaultPrepTime: 0,
      defaultPostTime: 0,
      defaultSnoozes: 0,
    },
  }).key);
};

firebaseMethods.newAlarm = function ({
  userId, label, time, prepTime, postTime, locationId, travelMethod,
}, cb) {
  cb(firebase.database().ref(`users/${userId}/alarms`).push({
    label,
    time,
    prepTime,
    postTime,
    onOff: false,
    location: locationId,
    travelMethod,
  }).key);
};

firebaseMethods.editAlarm = function ({
  userId, alarmId, label, time, prepTime, postTime, onOff, locationId, travelMethod,
}, cb) {
  cb(firebase.database().ref(`users/${userId}/alarms/${alarmId}`).update({
    label,
    time,
    prepTime,
    postTime,
    onOff,
    location: locationId,
    travelMethod,
  }).key);
};

firebaseMethods.deleteAlarm = function (data) {
  firebase.database().ref(`users/${data.userId}/alarms/${data.alarmId}`).remove();
};

firebaseMethods.getAlarms = function ({ userId, GPSLat, GPSLong }, cb) {
  firebase.database().ref(`users/${userId}/alarms/`).on('value', (snapshot) => {
    const snapshots = [];

    snapshot.forEach((child) => {
      let alarmObj = Object.assign({}, { alarmId: child.key }, child.val());
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

firebaseMethods.getAlarm = function ({ userId, alarmId, GPSLat, GPSLong }, cb) {
  console.log('herer we are once again', alarmId, userId);
  firebase.database().ref(`users/${userId}/alarms/${alarmId}`).once('value').then((snapshot) => {
    console.log('snnapshot value :', snapshot.val());
    const snap = snapshot.val();
    snap.alarmId = alarmId;
    getCommuteTime(snap, GPSLat, GPSLong).then(result => cb(result));
  });
};

firebaseMethods.saveSettings = function (settings, cb) {
  cb(firebase.database().ref(`users/${settings.userId}/userSettings`).set({
    defaultPrepTime: settings.prepTime,
    defaultPostTime: settings.postTime,
    defaultSnoozes: settings.snoozes,
    defaultSnoozeTime: settings.snoozeTime,
  }).key);
};

firebaseMethods.seed1 = () => {
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
        onOff: true,
        location: 'ChIJs980r6hZwokRJrYJwpNFwPE',
      },
      alarm2: {
        label: 'bed',
        time: 1521472080122,
        preptime: 20,
        onOff: true,
        location: 'ChIJs980r6hZwokRJrYJwpNFwPE',
      },
    },
  });
};


module.exports = firebaseMethods;

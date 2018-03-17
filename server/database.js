
var firebase = require('./config').firebase;

var usersRef = firebase.database().ref('users/');

var firebaseMethods = {};


firebaseMethods.newUser = function(username) {
    userRef.push({
        username: username
    })
}

firebaseMethods.seed1 =  function() {
 usersRef.push({
  username: "Sally",
  password: "nos",
  alarms: {
    alarm1: {
      label: "work",
      time: 800,
      preptime: 20,
      on: true,
      location: null
    },    
    alarm2: {
      label: "bed",
      time: 2200,
      preptime: 20,
      on: true,
      location: null
    }

  }
})
}

firebaseMethods.seed2 = function () {
usersRef.push({
  username: "John",
  password: "son",
  alarms: {
    alarm1: {
      label: "breakfast",
      time: 1000,
      preptime: 10,
      on: true,
      location: null
    },    
    alarm2: {
      label: "bed",
      time: 2300,
      preptime: 20,
      on: true,
      location: null
    }

  }
})
}

module.exports = firebaseMethods;
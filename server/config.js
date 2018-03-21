const firebase = require('firebase');

const firebaseConfig = {
    apiKey: "AIzaSyCxTgiAadnOZE1imxmNr6QX-eyQYYWcmrs",
    authDomain: "real-e8ea9.firebaseapp.com",
    databaseURL: "https://real-e8ea9.firebaseio.com",
    projectId: "real-e8ea9",
    storageBucket: "",
    messagingSenderId: "459834120805"
  };

firebase.initializeApp(firebaseConfig);

module.exports = {
  firebase: firebase,
  googleMapsAPI: 'AIzaSyCl-2Uv85jzATOsolRsSavBM7filgsFqkg',
};

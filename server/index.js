const express = require('express');
const parser = require('body-parser');
const firebase = require('./database');
const { getCommuteTime } = require('./apiHelpers');
const passport = require("passport");
const googleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys.js');
var axios =require('axios');
const app = express();

var mega = function(token){
    // console.log("real data", data);
    var headers = {
      access_token: token
    }
    axios.get(`https://www.googleapis.com/calendar/v3/calendars/hackreactor.com_v5k5rbga5om6rvfl65r259c0tk@group.calendar.google.com/events/38ftghf7e8ic5gpf23a8llovus?access_token=${token}`, headers)
    .then((data) => {
      console.log("data" ,data.data)
    })
    .catch((err) => {
      console.log("err" , err);
    })
}


app.use(parser.json());
app.use( passport.initialize());
app.use( passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.use(
  new googleStrategy({
    callbackURL: '/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
  }, (accessToken, refreshToken, profile, done) => {
    //passport callback function
    console.log(accessToken)
    mega(accessToken);
    // firebase.storeToken(accessToken);
    return done(null, profile);
  })
)



//callback for google to redirect to calendar

app.get('/auth/google/redirect', passport.authenticate('google', { 
  successRedirect: '/login',
  failureRedirect: '/login'
}), (req, res) => {

});
//login with token for google calendar
app.get('/login', (req, res) => {



  res.status(200).send("callback URI");
});


//auth with google
app.get('/google', passport.authenticate('google', {
  scope: [ 'profile', 'https://www.googleapis.com/auth/calendar']
}));



// ====================================================================================

app.get('/', (req, res) => {
  res.status(200).send('it works');
});

app.get('/user/new', (req, res) => {
  firebase.newUser((key) => {
    res.status(200).send(key);
  });
});

app.post('/alarm/save', (req, res) => {
  console.log(req.body);
  firebase.newAlarm((req.body), (dat) => {
    res.status(200).send(dat);
  });
});

app.post('/alarm/edit', (req, res) => {
  firebase.editAlarm((req.body), (dat) => {
    res.status(200).send(dat);
  });
});

app.post('/alarm/delete', (req, res) => {
  firebase.deleteAlarm((req.body));
  res.status(200).send('done');
});

// ~~~~~Settings Screen Routes~~~~~~~
app.post('/settings/save', ({ body }, res) => {
  firebase.saveSettings(body, (key) => {
    res.status(200).send(key);
  });
});

// ~~~~~Web Worker Routes~~~~~~~
app.get('/commutetime', ({ query }, res) => {
  firebase.getAlarms(query, (result) => {
    res.send(result);
  });
});

app.get('/commutetime/single', ({ query }, res) => {
  firebase.getAlarm(query, (result) => {
    console.log('RESULT: ', result);
    res.send(result);
  });
});


app.listen(8082, () => {
  console.log('listening on port 8082');
});

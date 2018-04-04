const express = require('express');
const parser = require('body-parser');
const firebase = require('./database');
const { getCommuteTime } = require('./apiHelpers');
const passport = require("passport");
const authRoutes = require('./auth-routes');

const app = express();

app.use(parser.json());
app.use(passport.initialize());
app.use(passport.session());

//auth middleware routes
app.use('/auth', authRoutes);


app.get('/', (req, res) => {
  res.status(200).send('it works');
});

app.get('/user/new', (req, res) => {
  firebase.newUser((key) => {
    res.status(200).send(key);
  });
});

app.post('/user/places', ({ body }, res) => {
  console.log('data sent to user/places:', body);
  firebase.savePlaces(body)
})

app.post('/user/geolocation', ({ body }, res) => {
  firebase.saveGeolocation(body)
})

app.post('/alarm/save', ({ body }, res) => {
  firebase.newAlarm((body), (dat) => {
    res.status(200).send(dat);
  });
});

app.post('/alarm/edit', (req, res) => {
  console.log(req.body);
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
    console.log('YO MONNNNN DIS WORKING?', body);
    res.status(200).send();
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

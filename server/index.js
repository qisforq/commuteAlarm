const express = require('express');
const parser = require('body-parser');

const firebase = require('./database')


const app = express();

app.use(parser.json());

app.get('/test', (req, res) => {
  res.status(200).send('it works');
});

app.get('/user/new', (req, res) => {
  console.log('index server');
  firebase.newUser((key) => res.status(200).send(key));
});

app.post('/alarm/save', (req, res) => {
  console.log(req.body);
  firebase.newAlarm((req.body), (dat) => {
    res.status(200).send(dat);
  })
});

// ~~~~~Settings Screen Routes~~~~~~~
app.post('/settings/save', ({body}, res) => {
  firebase.saveSettings(body, (key) => {
    res.status(200).send(key);
  })
});


app.listen(8082, () => {
  console.log('listening on port 8082');
});

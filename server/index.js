const express = require('express');
const parser = require('body-parser');

const firebase = require('./database')


const app = express();

app.use(parser.json());

app.get('/test', (req, res) => {
  res.status(200).send('it works');
});

app.get('/user/new', (req, res) => {
  firebase.newUser((key) => res.status(200).send(key));
});

app.post('/alarm/save', (req, res) => {
  firebase.newAlarm((req.body), (dat) => {
    res.status(200).send(dat);
  })
});

// ~~~~~Settings Screen Routes~~~~~~~
app.post('/settings/save', ({body}, res) => {
  console.log(body, "<<<")
});


app.listen(8082, () => {
  console.log('listening on port 8082');
});

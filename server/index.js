const express = require('express');
const parser = require('body-parser');

const firebase = require('./database')


const app = express();

app.use(parser.json());

app.get('/test', (req, res) => {
  res.status(200).send('it works');
})


app.listen(8082, () => {
  console.log('listening on port 8082');
});
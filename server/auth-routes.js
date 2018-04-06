const router = require('express').Router();
const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys.js');
const firebase = require('./database');
var axios = require('axios');

const checkToken = function checkIfAccessTokenIsExpiredAndRenew(userId, accessToken, refreshToken, expirationDate, minTime, maxTime, cb) {
  console.log("expiration date:", expirationDate, "is it in the past?", expirationDate < Date.now());
  if (expirationDate < Date.now()) {
    axios.post(`https://www.googleapis.com/oauth2/v4/token?refresh_token=${refreshToken}&client_id=${keys.google.clientID}&client_secret=${keys.google.clientSecret}&grant_type=refresh_token`)
    .then(({ data }) => {
      let { access_token, expires_in } = data;
      firebase.storeToken(access_token, refreshToken, userId, expires_in)
      console.log('Check this data for a token', typeof expires_in);
      return mega(access_token, minTime, maxTime, cb);
    })
    .catch((err) => {
      console.error('Error inside axios post to request new refresh token:', err.response.data)
    })
  } else {
    return mega(accessToken, minTime, maxTime, cb);
  }
}


const mega = function(token, minTime, maxTime, cb) {
  const headers = {
    access_token: token,
  }
  let finalArray = [];
  console.log("THIS IS THE TOKEN:", token);
  axios.get(`https://www.googleapis.com/calendar/v3/calendars/primary/events/?access_token=${token}&timeMin=${minTime}&timeMax=${maxTime}`, headers)
  .then((data) => {
    console.log("\\^o^/", minTime, maxTime);

    let newArray = data.data.items.map((item) => {
      return {
        name: item.summary,
        id: item.id,
        location: item.location || '',
      }
    })
    finalArray = newArray.map((item, i) => {
      let id = item.id;
        axios.get(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${id}?access_token=${token}`)
        .then((res) => {
          item.time = res.data.start;
          item.endTime = res.data.end;
          cb(item, newArray.length-1 === i);
          // firebase.storeCalendar(item);
        }).catch((err) => {
          console.log("err");
        })
    })
    })
  .catch((err) => {
    console.error("Error inside axios call to mega");
  })
  return finalArray
}


//init google strategy
passport.use(
  new googleStrategy({
    callbackURL: '/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    passReqToCallback: true,
  }, (reqThingy, accessToken, refreshToken, profile, done) => {
    //passport callback function
    firebase.storeToken(accessToken, refreshToken, reqThingy.query.state)
    firebase.storeProfile(profile, reqThingy.query.state);
    return done(null, profile);
  })
)


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


router.get('/calendar', ({ query }, res) => {
  console.log("hit calendar");
  firebase.getToken(query.userId).then(async ({ accessToken, refreshToken, expirationDate }) => {
    let arr = []

    await checkToken(query.userId, accessToken, refreshToken, expirationDate, query.minTime, query.maxTime, (item, end) => {
      arr.push(item);
      if (end) {
        console.log('HERE WE GO!', arr)
        res.status(200).send(arr);
      }
    });
  }).catch((err) => {
    console.log('error');
  })
})

router.post('/checktoken', ({ body }, res) => {
  console.log('WHAT WHAT WQHATTTTT', body)
  firebase.getToken(body.userId)
  .then(({ accessToken, refreshToken }) => {
    console.log('YOOOOO googuh', accessToken, refreshToken)
    const headers = {
      access_token: accessToken,
    }
    axios.get(`https://www.googleapis.com/calendar/v3/colors/?access_token=${accessToken}`, headers)
    .then(() => {
      console.log('yayy it worked');
      res.status(200).send()
    })
    .catch(() => {
      console.log('yayyy it didnt work!');
      res.status(202).send()
    })
  })
  .catch(console.error('error in checktoken'))
})


router.get('/test', (req, res) => {
  console.log("hit auth test");
})
//callback for google to redirect to calendar

router.get('/google/redirect/', passport.authenticate('google', {
  successRedirect: 'commutealarm://success',
  failureRedirect: 'commutealarm://failure',
}));

router.get('/google', (req, res, next) => {
  console.log("req1", req.query);
  passport.authenticate('google', {
    scope: ['profile', 'https://www.googleapis.com/auth/calendar'],
    accessType: 'offline',
    prompt: 'consent',
    state: req.query.userId,
  })(req, res, next);
});
//login with token for google calendar
// router.get('/success', (req, res) => {
//   // res.status(200).send("callback URI");
//   res.redirect(301, 'commutealarm://');
// });

router.get('/login', (req, res) => {
  firebase.getToken(req.body.params.id).then((token) => {
  });
});

router.get('/token', (req, res) => {
  firebase.getToken(req.query.userId).then((token) => {
    res.send({token,})
  });
})


module.exports = router;

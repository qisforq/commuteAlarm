import axios from 'axios';
import BackgroundGeolocation from "react-native-background-geolocation";

module.exports = {
  getCommuteData: (userId, that) => {
    BackgroundGeolocation.getCurrentPosition((location) => {
      console.log('- Current position received!!!!');
      let {latitude, longitude} = location.coords;
      console.log('latitude:', typeof latitude);
      console.log('longitude', longitude);

      axios.get('http://localhost:8082/commutetime', {
        params: {
          userId: userId,
          GPSLat: latitude,
          GPSLong: longitude,
        }
      })
      .then((alarmCommuteData) => {
        that.setState({
          alarmCommuteData: alarmCommuteData
        }, ()=>{console.log('alarmCommuteData-->>',that.state.alarmCommuteData)});
      }).catch((err) => {
        console.log('Error in axios.get(/commutetime)',err);
      })
    }, (errorCode) => {
      switch (errorCode) {
        case 0:
          alert('Failed to retrieve location');
          break;
        case 1:
          alert('You must enable location services in Settings');
          break;
        case 2:
          alert('Network error');
          break;
        case 408:
          alert('Location timeout');
          break;
      }
    }, {
      timeout: 30,      // 30 second timeout to fetch location
      persist: false,
      maximumAge: 5000, // Accept the last-known-location if not older than 5000 ms.
      desiredAccuracy: 10,  // Try to fetch a location with an accuracy of `10` meters.
      samples: 3,   // How many location samples to attempt.
    });
  },
  test: () => {
    console.log('THIS IS A TEST');
  }
}

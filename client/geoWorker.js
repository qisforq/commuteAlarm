import BackgroundGeolocation from "react-native-background-geolocation";
import { getCommuteData } from './commuteWorkers';

const geoConfig = {
    desiredAccuracy: 0,
    distanceFilter: 15,
    // Activity Recognition
    stopTimeout: 2,
    // Application config
    debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
    logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
    stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
    startOnBoot: true, // <-- Auto start tracking when device is powered-up.
  }

  const getLocationSuccess = () => {}

  const getLocationErr = (errorCode) => {
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
      default:
          break;
      }
  };

  const getLocationParams = {
    timeout: 30,      // 30 second timeout to fetch location
    persist: false,
    maximumAge: 5000, // Accept the last-known-location if not older than 5000 ms.
    desiredAccuracy: 10,  // Try to fetch a location with an accuracy of `10` meters.
    samples: 3,   // How many location samples to attempt.
  };
  
module.exports = { geoConfig, getLocationParams, getLocationErr }
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

const geoSuccess = (state, that) => {
    // console.warn('geoSuccess running!!! Here is this.state:', that.state)
    // if (!state.enabled) {
    //   // Start tracking!
    // console.warn('geoSuccess state.enabled!')
      
    //   BackgroundGeolocation.start(() => {
    //       console.warn("that.state=", that.state)
    //       getCommuteData(that.state.userId, that);
    //       console.log('- BackgroundGeolocation is configured and ready: ', state.enabled);
    //   });
    // }
  }


  const getLocationSuccess = () => {}

  const getLocationErr = () => {}
  
module.exports = { geoConfig, geoSuccess, getLocation }
import React from 'react';
import BottomNavigation from './BottomNavigation';
import {Button, View, Text, TextInput, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { RadioButtons, SegmentedControls } from 'react-native-radio-buttons'
import DateTimePicker from 'react-native-modal-datetime-picker';
import ModalDropdown from 'react-native-modal-dropdown';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import store from 'react-native-simple-store';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';

export default class AddScreen extends React.Component {
  constructor(props) {
    super(props);
    let { params } = this.props.navigation.state
    if(this.props.navigation.state.params.data) {
      this.state = {
        showTime: false,
        label: params.data.label,
        time: params.data.time,
        prepTime: params.data.prepTime,
        postTime: params.data.postTime,
        locationId: params.data.locationId,
        address: params.data.address,
        snoozes: params.data.snoozes,
        snoozeTime: params.data.snoozeTime,
        alarmSound: params.data.alarmSound,
        onOff: params.data.onOff,
        edit: true,
        travelMethod: params.data.travelMethod,
        showPlaces: true,
        backgroundColor: 'white'
      };
    } else if (params.fromCalendar) {
      this.state = {
        showTime: false,
        label: params.alarmName,
        time: params.alarmTime.getTime(),
        prepTime: params.settings.prepTime,
        postTime: params.settings.postTime,
        locationId: params.place_id,
        address: params.formatted_address,
        snoozes: params.settings.snoozes,
        snoozeTime: params.settings.snoozeTime,
        alarmSound: params.settings.alarmSound,
        onOff: false,
        edit: false,
        travelMethod: 'Transit',
        showPlaces: true,
        backgroundColor: 'white'
      }
    } else {
      this.state = {
        showTime: false,
        label: 'Alarm',
        time: '',
        prepTime: params.settings.defaultPrepTime,
        postTime: params.settings.defaultPostTime,
        locationId: null,
        address: 'Search',
        snoozes: params.settings.defaultSnoozes,
        snoozeTime: params.settings.defaultSnoozeTime,
        alarmSound: params.settings.defaultAlarmSound,
        onOff: false,
        edit: false,
        travelMethod: 'Driving',
        showPlaces: false,
        backgroundColor: 'white'
      }
    }

    this.saveAlarm = this.saveAlarm.bind(this);
    this.savePlacesToDB = this.savePlacesToDB.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      title: navigation.state.params.data ? 'Edit Alarm' : 'Add Alarm',
    }
  };

  componentWillMount() {

  }

  handleTimePicked = (time) => {
    this.setState({
      showTime: false,
      time: time.getTime(),
    });
  }
  savePlacesToDB(places, userId) {
    axios.post('http://localhost:8082/user/places', {
      places,
      userId,
    }).catch((err) => {
      console.log('Error saving places to DB:', err)
    })
  }

  saveAlarm() {
    let { label, time, prepTime, postTime, locationId, address, snoozes, snoozeTime, alarmSound, onOff, travelMethod } = this.state;
    store.get('places').then((places) => {
      if (places[locationId]) {
        places[locationId].count += 1;
      } else {
        places[locationId] = {
          count: 1,
          address,
        };
      }
      this.savePlacesToDB(places, this.props.navigation.state.params.userId)

      store.save('places', places)
    })

    if(this.state.edit) {
      axios.post('http://localhost:8082/alarm/edit', {
        userId: this.props.navigation.state.params.userId,
        alarmId: this.props.navigation.state.params.data.id,
        label,
        time,
        prepTime,
        postTime,
        locationId,
        onOff,
        address,
        snoozes,
        snoozeTime,
        travelMethod,
        alarmSound
      })
      .then(data => {
        store.get('alarms').then(alarms => {
          alarms[this.props.navigation.state.params.data.id] = {
            label,
            time,
            prepTime,
            postTime,
            onOff,
            locationId,
            address,
            snoozes,
            snoozeTime,
            travelMethod,
            alarmSound
          };
          store.save('alarms', alarms).then(() => {
            if(onOff) {
              this.props.navigation.state.params.commuteData('commutetime/single', this.props.navigation.state.params.data, true)
            } else {
              this.props.navigation.navigate('AlarmsScreen');
            }
          });
        })
      })
      .catch(console.log('error updating the alarm'))
    } else {
      axios.post('http://localhost:8082/alarm/save', {
        userId: this.props.navigation.state.params.userId,
        label,
        time,
        prepTime,
        postTime,
        locationId,
        address,
        snoozes,
        snoozeTime,
        travelMethod,
        alarmSound,
      })
      .then(data => {
        store.get('alarms').then(alarms => {
          alarms[data.data] = {
            label,
            time,
            prepTime,
            postTime,
            onOff: false,
            locationId,
            address,
            snoozes,
            snoozeTime,
            travelMethod,
            alarmSound,
          };
          store.save('alarms', alarms).then(() => {
            this.props.navigation.navigate('AlarmsScreen');
          });
        })
      })
      .catch(err => console.log('error saving alarm:', err));
    }
  }

  render() {
    console.log(this.state.alarmSound);
    let timeString = new Date(this.state.time).toLocaleTimeString()
    timeString = timeString.split('')
    timeString.splice(timeString.indexOf(':', 3), 3);
    timeString = timeString.join('');
    let favPlaces = this.props.navigation.state.params.favPlaces;
    return (
      <LinearGradient colors={['#7ad8db', '#33b8bd']} style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
          {!this.state.showPlaces ?
            <View style={{ flex: 0, position: 'absolute', width: '100%', top: '20%', zIndex: 100 }}>
              <Button
                title="Search Places"
                onPress={() => this.setState({ showPlaces: true })}
              />
            </View> :
            <View style={{ flex: 0, position: 'absolute', width: '100%', top: '20%', backgroundColor: this.state.backgroundColor, zIndex: 100 }}>
              <GooglePlacesAutocomplete
                listUnderlayColor="gray"
                autoFocus={false}
                listViewDisplayed='false'
                onSelect={() => this.setState({ backgroundColor: 'white' })}
                styles={{
                  textInputContainer: {
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                    borderRightWidth: 0,
                    borderLeftWidth: 0,
                    borderColor: "transparent",
                    borderRightColor: "grey",
                    borderLeftColor: "grey",
                    width: '100%',
                    backgroundColor: 'transparent',
                    //color: 'white',
                  },
                  textInput: {
                    textAlign: 'center',
                  },
                  predefinedPlacesDescription: {
                    color: 'black',
                    textAlign: 'center',
                    backgroundColor: 'transparent',
                  },
                  listView: {
                    backgroundColor: 'transparent',
                  }
                }}
                placeholder={this.state.address}
                minLength={2} // minimum length of text to search
                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                  this.setState({
                    locationId: data.place_id,
                    address: data.description,
                    backgroundColor: 'transparent',
                  });
                }}
                query={{
                  key: 'AIzaSyAZkNBg_R40VwsvNRmqdGe7WdhkLVyuOaw',
                  language: 'en', // language of the results
                }}
                debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                GooglePlacesSearchQuery={{rankby: 'distance'}}
                predefinedPlaces={favPlaces}
              />
            </View>
          }
        <View style={{ flex: 1.5, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', width: '70%' }}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Text style={{ fontWeight: '800' }}>Alarm Label: </Text>
            <TextInput
              onChangeText={(text) => this.setState({ label: text })}
              value={this.state.label}
            />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Text style={{ fontWeight: '800' }}>Arrival Time: </Text>
            <TouchableOpacity
              onPress={() => this.setState({ showTime: true })}
            >
              <Text>{this.state.time ? timeString + ' ' + new Date(this.state.time).toDateString(): 'Select Date and Time'}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
            <Text style={{ fontWeight: '800' }}>Address: </Text>
          </View>
        </View>
        <DateTimePicker
          isVisible={this.state.showTime}
          mode={'datetime'}
          onConfirm={this.handleTimePicked}
          onCancel={() => this.setState({ showTime: false })}
        />
        <View style={{ flex: 1 }} />
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '60%' }}>
          <Text style={{ fontWeight: '800' }}>Travel Method: {"\n"}</Text>
          <SegmentedControls
            options={ ['Transit', 'Driving'] }
            onSelection={(opt) => { this.setState({ travelMethod: opt })}}
            selectedOption={ this.state.travelMethod }
          />
        </View>
        <View style={{ flex: 0.5 }} />
        <View style={{ flex: 2, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', width: '70%'}}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Text style={{ fontWeight: '800' }}>Prep Time Needed: </Text>
            <ModalDropdown
              dropdownStyle={{ borderWidth: 1, borderColor: 'black' }}
              defaultIndex={Number(this.state.prepTime)}
              defaultValue={this.state.prepTime*5 + ' minutes'}
              options={[...Array(13)].map((x,i) => (i)*5 + ' minutes ')}
              onSelect={(idx, val) => this.setState({ prepTime: idx })}
            />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Text style={{ fontWeight: '800' }}>Post Time Needed: </Text>
            <ModalDropdown
              dropdownStyle={{ borderWidth: 1, borderColor: 'black' }}
              defaultIndex={this.state.postTime}
              defaultValue={this.state.postTime*5 + ' minutes'}
              options={[...Array(13)].map((x,i) => (i)*5 + ' minutes  ')}
              onSelect={(idx, val) => this.setState({ postTime: idx })}
            />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Text style={{ fontWeight: '800' }}>Snoozes: </Text>
            <ModalDropdown
              dropdownStyle={{ borderWidth: 1, borderColor: 'black' }}
              defaultIndex={Number(this.state.snoozes)}
              defaultValue={this.state.snoozes + ` snooze${this.state.snoozes === 1 ? '' : 's'}`}
              options={[...Array(12)].map((x,i) => (i) + ` snooze${i===1 ? '' : 's'} `)}
              onSelect={(idx, val) => this.setState({ snoozes: Number(idx) })}
            />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Text style={{ fontWeight: '800' }}>Snooze Time: </Text>
            <ModalDropdown
              dropdownStyle={{ borderWidth: 1, borderColor: 'black' }}
              defaultIndex={Number(this.state.snoozeTime)}
              defaultValue={this.state.snoozeTime + ' snoozes'}
              options={[...Array(13)].map((x,i) => i + ' minutes  ')}
              onSelect={(idx, val) => this.setState({ snoozeTime: Number(idx) })}
            />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Text style={{ fontWeight: '800' }}>Alarm Sound: </Text>
            <ModalDropdown
              dropdownStyle={{ borderWidth: 1, borderColor: 'black' }}
              defaultValue={this.state.alarmSound}
              options={['annoying', 'alarmchi', 'eternity']}
              onSelect={(idx, val) => {
                this.setState({ alarmSound: val })
              }}
            />
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Button
            title="Save"
            onPress={this.saveAlarm}
          />
        </View>
        <View style={{ flex: 1 }}></View>
        </View>
      </LinearGradient>
    );
  }
}

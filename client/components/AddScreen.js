import React from 'react';
import BottomNavigation from './BottomNavigation';
import {Button, View, Text, TextInput, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { RadioButtons, SegmentedControls } from 'react-native-radio-buttons'
import DateTimePicker from 'react-native-modal-datetime-picker';
import ModalDropdown from 'react-native-modal-dropdown';
import CustomMultiPicker from "../../custom_modules/react-native-multiple-select-list";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import store from 'react-native-simple-store';
import axios from 'axios';


export default class AddScreen extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    let { data, settings } = this.props.navigation.state.params
    if(this.props.navigation.state.params.data) {
      this.state = {
        showTime: false,
        label: data.label,
        time: data.time,
        prepTime: data.prepTime,
        postTime: data.postTime,
        locationId: data.locationId,
        address: data.address,
        snoozes: data.snoozes,
        snoozeTime: data.snoozeTime,
        alarmSound: data.alarmSound,
        onOff: data.onOff,
        edit: true,
        travelMethod: data.travelMethod,
      };
    } else {
      this.state = {
        showTime: false,
        label: 'Alarm',
        time: '',
        prepTime: settings.defaultPrepTime,
        postTime: settings.defaultPostTime,
        locationId: null,
        address: 'Search',
        snoozes: settings.defaultSnoozes,
        snoozeTime: settings.defaultSnoozeTime,
        alarmSound: settings.defaulAlarmSound,
        onOff: false,
        edit: false,
        travelMethod: 'Driving',
      };
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
          console.log(alarms);
          store.save('alarms', alarms).then(() => {
            if(onOff) {
              console.log('its goioooing', onOff);
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
        console.log(data.data);
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
          console.log(alarms);
          store.save('alarms', alarms).then(() => {
            this.props.navigation.navigate('AlarmsScreen');
          });
        })
      })
      .catch(err => console.log('error saving alarm:', err));
    }
  }

  render() {
    let timeString = new Date(this.state.time).toLocaleTimeString()
    timeString = timeString.split('')
    timeString.splice(timeString.indexOf(':', 3), 3);
    timeString = timeString.join('');
    let favPlaces = this.props.navigation.state.params.favPlaces;
    console.log(favPlaces);
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
        <View style={{ flex: 0, position: 'absolute', width: '100%', top: '18%', backgroundColor: 'white', zIndex: 100 }}>
          <GooglePlacesAutocomplete
            listUnderlayColor="white"
            styles={{
              textInputContainer: {
                backgroundColor: 'rgba(0,0,0,0)',
                borderWidth: 1,
                borderRightWidth: 0.3,
                borderLeftWidth: 0.3,
                borderColor: "black",
                borderRightColor: "grey",
                borderLeftColor: "grey",
                width: '100%',
              },
              textInput: {
                textAlign: 'center',
              },
            }}
            placeholder={this.state.address}
            minLength={2} // minimum length of text to search
            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
              console.log(details);
              console.log(data);
              this.setState({
                locationId: data.place_id,
                address: data.description,
              }, () => console.log(this.state));
            }}
            query={{
              key: 'AIzaSyAZkNBg_R40VwsvNRmqdGe7WdhkLVyuOaw',
              language: 'en', // language of the results
            }}
            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
            predefinedPlaces={favPlaces}
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '60%' }}>
          <Text style={{ fontWeight: '800' }}>Alarm Label: </Text>
          <TextInput
            onChangeText={(text) => this.setState({ label: text })}
            value={this.state.label}
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
          <Text style={{ fontWeight: '800' }}>Address: </Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '60%'  }}>
          <Text style={{ fontWeight: '800' }}>DateTime: </Text>
          <TouchableOpacity
            onPress={() => this.setState({ showTime: true })}
          >
            <Text>{this.state.time ? timeString + ' ' + new Date(this.state.time).toDateString(): 'Select Date and Time'}</Text>
          </TouchableOpacity>
        </View>
        <DateTimePicker
          isVisible={this.state.showTime}
          mode={'datetime'}
          onConfirm={this.handleTimePicked}
          onCancel={() => this.setState({ showTime: false })}
        />
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
            <Text style={{ fontWeight: '800' }}>Prep Time Needed: </Text>
            <ModalDropdown
              dropdownStyle={{ borderWidth: 1, borderColor: 'black' }}
              defaultIndex={Number(this.state.prepTime)}
              defaultValue={this.state.prepTime*5 + ' minutes'}
              options={[...Array(13)].map((x,i) => (i)*5 + ' minutes ')}
              onSelect={(idx, val) => this.setState({ prepTime: idx })}
            />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
            <Text style={{ fontWeight: '800' }}>Post Time Needed: </Text>
            <ModalDropdown
              dropdownStyle={{ borderWidth: 1, borderColor: 'black' }}
              defaultIndex={this.state.postTime}
              defaultValue={this.state.postTime*5 + ' minutes'}
              options={[...Array(13)].map((x,i) => (i)*5 + ' minutes  ')}
              onSelect={(idx, val) => this.setState({ postTime: idx })}
            />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
            <Text style={{ fontWeight: '800' }}>Snoozes: </Text>
            <ModalDropdown
              dropdownStyle={{ borderWidth: 1, borderColor: 'black' }}
              defaultIndex={Number(this.state.snoozes)}
              defaultValue={this.state.snoozes + ` snooze${this.state.snoozes === 1 ? '' : 's'}`}
              options={[...Array(12)].map((x,i) => (i) + ` snooze${i===1 ? '' : 's'} `)}
              onSelect={(idx, val) => this.setState({ snoozes: Number(idx) })}
            />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
            <Text style={{ fontWeight: '800' }}>Snooze Time: </Text>
            <ModalDropdown
              dropdownStyle={{ borderWidth: 1, borderColor: 'black' }}
              defaultIndex={Number(this.state.snoozeTime)}
              defaultValue={this.state.snoozeTime + ' snoozes'}
              options={[...Array(13)].map((x,i) => i + ' minutes  ')}
              onSelect={(idx, val) => this.setState({ snoozeTime: Number(idx) })}
            />
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '60%' }}>
          <Text style={{ fontWeight: '800' }}>Travel Method: {"\n"}</Text>
          <SegmentedControls
            options={ ['Transit', 'Driving'] }
            onSelection={(opt) => { this.setState({ travelMethod: opt })}}
            selectedOption={ this.state.travelMethod }
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '60%'  }}>
          <Text style={{ fontWeight: '800' }}>Alarm Sound: </Text>
          <ModalDropdown
            dropdownStyle={{ borderWidth: 1, borderColor: 'black' }}
            defaultValue={this.state.alarmSound}
            options={['annoying', 'alarmchi']}
            onSelect={(idx, val) => {
              this.setState({ alarmSound: val })
            }}
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '60%'  }}>
          <Text style={{ fontWeight: '800' }}>Repeat Days: </Text>
          <CustomMultiPicker
            options={{0: 'Monday', 1: 'Tuesday', 2: 'Wednesday', 3: 'Thursday', 4: 'Friday', 5: 'Saturday', 6: 'Sunday'}}
            multiple={true}
            placeholder={"Search"}
            placeholderTextColor={'#757575'}
            returnValue={"value"}
            callback={(res)=>{ console.log(Number('res')) }} // callback, array of selected items
            rowBackgroundColor={"#eee"}
            rowHeight={40}
            rowRadius={5}
            iconColor={"#00a2dd"}
            iconSize={30}
            selectedIconName={"ios-checkmark-circle-outline"}
            unselectedIconName={"ios-radio-button-off-outline"}
            scrollViewHeight={130}
            selected={[1,2]} // list of options which are selected by default
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Button
            title="Save"
            onPress={this.saveAlarm}
          />
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
    );
  }
}

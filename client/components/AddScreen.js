import React from 'react';
import BottomNavigation from './BottomNavigation';
import {Button, View, Text, TextInput, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { RadioButtons, SegmentedControls } from 'react-native-radio-buttons'
import DateTimePicker from 'react-native-modal-datetime-picker';
import ModalDropdown from 'react-native-modal-dropdown';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import store from 'react-native-simple-store';
import axios from 'axios';


export default class AddScreen extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    if(this.props.navigation.state.params.data) {
      this.state = {
        showTime: false,
        label: this.props.navigation.state.params.data.label,
        time: this.props.navigation.state.params.data.time,
        prepTime: this.props.navigation.state.params.data.prepTime,
        postTime: this.props.navigation.state.params.data.postTime,
        locationId: this.props.navigation.state.params.data.locationId,
        address: this.props.navigation.state.params.data.address,
        onOff: this.props.navigation.state.params.data.onOff,
        edit: true,
        travelMethod: this.props.navigation.state.params.data.travelMethod,
      };
    } else {
      this.state = {
        showTime: false,
        label: 'Alarm',
        time: '',
        prepTime: this.props.navigation.state.params.settings.defaultPrepTime,
        postTime: this.props.navigation.state.params.settings.defaultPostTime,
        locationId: null,
        address: 'Search',
        onOff: false,
        edit: false,
        travelMethod: 'Driving',
      };
    }

    this.saveAlarm = this.saveAlarm.bind(this);
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

  saveAlarm() {
    let { label, time, prepTime, postTime, locationId, address, onOff, travelMethod } = this.state;
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
        travelMethod,
      }).then(data => {
        store.get('alarms').then(alarms => {
          alarms[this.props.navigation.state.params.data.id] = {
            label,
            time,
            prepTime,
            postTime,
            onOff,
            locationId,
            address,
            travelMethod,
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
      });
    } else {
      axios.post('http://localhost:8082/alarm/save', {
        userId: this.props.navigation.state.params.userId,
        label,
        time,
        prepTime,
        postTime,
        locationId,
        address,
        travelMethod,
      }).then(data => {
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
            travelMethod,
          };
          store.save('alarms', alarms).then(() => {
            this.props.navigation.navigate('AlarmsScreen');
          });
        })
      }).catch(err => console.log(err));
    }
  }

  render() {
    let timeString = new Date(this.state.time).toLocaleTimeString()
    timeString = timeString.split('')
    timeString.splice(timeString.indexOf(':', 3), 3);
    timeString = timeString.join('');
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
        <View style={{ flex: 0, position: 'absolute', width: '100%', top: '20%', backgroundColor: 'white', zIndex: 100 }}>
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
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '60%'  }}>
          <Text style={{ fontWeight: '800' }}>Prep Time Needed: </Text>
          <ModalDropdown
            dropdownStyle={{ borderWidth: 1, borderColor: 'black' }}
            defaultIndex={Number(this.state.prepTime)}
            defaultValue={this.state.prepTime*5 + ' minutes'}
            options={[...Array(13)].map((x,i) => (i)*5 + ' minutes ')}
            onSelect={(idx, val) => this.setState({ prepTime: idx })}
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '60%'  }}>
          <Text style={{ fontWeight: '800' }}>Post Time Needed: </Text>
          <ModalDropdown
            dropdownStyle={{ borderWidth: 1, borderColor: 'black' }}
            defaultIndex={this.state.postTime}
            defaultValue={this.state.postTime*5 + ' minutes'}
            options={[...Array(13)].map((x,i) => (i)*5 + ' minutes  ')}
            onSelect={(idx, val) => this.setState({ postTime: idx })}
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '60%' }}>
          <Text style={{ fontWeight: '800' }}>Travel Method: {"\n"}</Text>
          {/* <RadioButtons
            options={['Transit', 'Driving']}
            //onSelection={(opt) => { this.setState({ travelMethod: opt })}}
            selectedOption={this.state.travelMethod }
            renderOption={(option, selected, onSelect, index) => (
              <TouchableWithoutFeedback onPress={() => { this.setState({ travelMethod: option })}} key={index}>
                <Text style={selected ? { fontWeight: 'bold' } : {}}>{option}</Text>
              </TouchableWithoutFeedback>
            )}
            renderContainer={(optionNodes) => (<View>{optionNodes}</View>)}
          /> */}
          <SegmentedControls
            options={ ['Transit', 'Driving'] }
            onSelection={(opt) => { this.setState({ travelMethod: opt })}}
            selectedOption={ this.state.travelMethod }
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

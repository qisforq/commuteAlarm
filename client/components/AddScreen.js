import React from 'react';
import BottomNavigation from './BottomNavigation';
import {Button, View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import ModalDropdown from 'react-native-modal-dropdown';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import store from 'react-native-simple-store';
import axios from 'axios';

export default class AddScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      label: 'Alarm',
      showTime: false,
      time: 'none',
      prepTime: 0,
      postTime: 0,
      locationId: null,
    };
    this.saveAlarm = this.saveAlarm.bind(this);
  }

  static navigationOptions = {
    title: 'Add Alarm',
    headerLeft: null,
  };

  handleTimePicked = (time) => {
    this.setState({
      showTime: false,
      time: time.getTime(),
    });
  }

  saveAlarm() {
    let { label, time, prepTime, postTime, locationId } = this.state;
    console.warn(this.props.navigation.state.params.userId);

    axios.post('http://localhost:8082/alarm/save', {
      userId: this.props.navigation.state.params.userId,
      label,
      time,
      prepTime,
      postTime,
      locationId,
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
        };
        store.save('alarms', alarms).then(console.log(store.get('alarms')));
      })
    });
  }

  render() {
    console.log(this.state.time);
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <TextInput
            onChangeText={(text) => this.setState({ label: text })}
            value={this.state.label}
          />
          <TouchableOpacity
            onPress={() => this.setState({ showTime: true })}
          >
            <Text>Select Date and Time</Text>
          </TouchableOpacity>
          <DateTimePicker
            isVisible={this.state.showTime}
            mode={'datetime'}
            onConfirm={this.handleTimePicked}
            onCancel={() => this.setState({ showTime: false })}
          />
          <ModalDropdown
            defaultIndex={this.state.prepTime}
            defaultValue="Prep Time"
            options={[...Array(13)].map((x,i) => (i)*5 + ' minutes               ')}
            onSelect={(idx, val) => this.setState({ prepTime: idx })}
          />
          <Text>{this.state.prepTime}</Text>

          <ModalDropdown
            defaultIndex={this.state.postTime}
            defaultValue="Post Time"
            options={[...Array(13)].map((x,i) => (i)*5 + ' minutes               ')}
            onSelect={(idx, val) => this.setState({ postTime: idx })}
          />


          <GooglePlacesAutocomplete
            placeholder='Search'
            minLength={2} // minimum length of text to search
            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
              console.log(data, details);
              this.setState({
                locationId: data.id,
              }, () => console.log(this.state));
            }}

            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: 'AIzaSyAZkNBg_R40VwsvNRmqdGe7WdhkLVyuOaw',
              language: 'en', // language of the results
              //types: '(cities)' // default: 'geocode'
            }}
            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
          />
          <Text>{this.state.locationId}</Text>
          <Button
            title="Save"
            onPress={this.saveAlarm}
          />
        </View>
        <BottomNavigation cur={3} nav={this.props.navigation}/>
      </View>
    );
  }
}

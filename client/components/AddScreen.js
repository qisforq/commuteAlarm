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
    if(this.props.navigation.state.params.data) {
      this.state = {
        showTime: false,
        label: this.props.navigation.state.params.data.label,
        time: this.props.navigation.state.params.data.time,
        prepTime: this.props.navigation.state.params.data.prepTime,
        postTime: this.props.navigation.state.params.data.postTime,
        locationId: this.props.navigation.state.params.data.locationId,
        edit: true
      };
    } else {
      this.state = {
        showTime: false,
        label: 'Alarm',
        time: 'none',
        prepTime: this.props.navigation.state.params.settings.defaultPrepTime,
        postTime: this.props.navigation.state.params.settings.defaultPostTime,
        locationId: null,
        edit: false,
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
    let { label, time, prepTime, postTime, locationId } = this.state;
    if(this.state.edit) {
      axios.post('http://localhost:8082/alarm/edit', {
        userId: this.props.navigation.state.params.userId,
        alarmId: this.props.navigation.state.params.data.id,
        label,
        time,
        prepTime,
        postTime,
        locationId,
      }).then(data => {
        store.get('alarms').then(alarms => {
          alarms[this.props.navigation.state.params.data.id] = {
            label,
            time,
            prepTime,
            postTime,
            onOff: false,
            locationId,
          };
          store.save('alarms', alarms).then(() => {
            this.props.navigation.navigate('AlarmsScreen');
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
          store.save('alarms', alarms).then(() => {
            this.props.navigation.navigate('AlarmsScreen');
          });
        })
      });
    }
  }

  render() {
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
            defaultIndex={this.state.prepTime/5}
            defaultValue="Prep Time"
            options={[...Array(13)].map((x,i) => (i)*5 + ' minutes               ')}
            onSelect={(idx, val) => this.setState({ prepTime: idx })}
          />
          <Text>{this.state.prepTime}</Text>

          <ModalDropdown
            defaultIndex={this.state.postTime/5}
            defaultValue="Post Time"
            options={[...Array(13)].map((x,i) => (i)*5 + ' minutes               ')}
            onSelect={(idx, val) => this.setState({ postTime: idx })}
          />

          <View style={{ height: 200 }}>
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
          </View>
          <Text>{this.state.locationId}</Text>
          <Button
            title="Save"
            onPress={this.saveAlarm}
          />
        </View>
      </View>
    );
  }
}

import React from 'react';
import BottomNavigation from './BottomNavigation';
import {Button, View, Text, TextInput, Picker, StyleSheet } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import HeaderButton from 'react-navigation-header-buttons'
import Icon from 'react-native-vector-icons/Ionicons.js';
import axios from 'axios';
import store from 'react-native-simple-store';
import { Linking } from 'react-native';

export default class SettingsScreen extends React.Component {
  constructor(props){
    super(props);
    let { userSettings } = props.navigation.state.params

    this.state = {
      prepTime: userSettings.defaultPrepTime,
      postTime: userSettings.defaultPostTime,
      snoozes: userSettings.defaultSnoozes,
      snoozeTime: userSettings.defaultSnoozeTime,
      alarmSound: userSettings.defaultAlarmSound,
      token: false,
    }
    this.toCalendarScreen = this.toCalendarScreen.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleOpenURL = this.handleOpenURL.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      title: 'Settings',
      headerLeft: null,
      headerRight: (
        <HeaderButton IconComponent={Icon} iconSize={23} color="blue">
          <HeaderButton.Item
            title="Done/Save"
            onPress={() => {
              params.saveSettings(params.userId, navigation.goBack)
            }}
          />
        </HeaderButton>
      ),
    }
  }


  componentWillMount() {
    // let {defaultPrepTime, defaultPostTime, defaultSnoozes} = this.props.navigation.state.params.userSettings;
    this.props.navigation.setParams({ saveSettings: this._saveSettings });
    store.get('token').then((token) => {
      this.setState({token: token},() => console.log('this is the state after getting token:', this.state))
    })
  }

  componentDidMount() {
    Linking.addEventListener('url', this.handleOpenURL);
    let { userId } = this.props.navigation.state.params
    axios.post("http://localhost:8082/auth/checktoken", {
      userId
    })
    .then(({ status }) => {
      if (status === 202) {
        store.save('token', false);
        this.setState({
          token: false,
        });
      }
    })
    .catch(() => {
      console.log('error in check token');
    })
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  handleOpenURL(event) {
    console.log(event.url.slice(15, 22), "the fuck man");
    let status = event.url.slice(15, 22)
    if (status === 'success') {
      console.log('SUCCESS!!!')
      store.save('token', true).then(() => {
        this.setState({
          token: true,
        }, this.toCalendarScreen);
      });
    } else if (status === 'failure'){
      console.log('FAILURE!! The good kind! =D')
      store.save('token', false);
      this.setState({
        token: false,
      })
    } else {
      console.log('Ok, something fishy is going on...');
    }
  }



  _saveSettings = (userId, goBack) => {
    let { prepTime, postTime, snoozes, snoozeTime, alarmSound } = this.state;
    axios.post('http://localhost:8082/settings/save', {
      userId,
      prepTime,
      postTime,
      snoozes,
      snoozeTime,
      alarmSound,
    })
    .catch((err) => {
      console.log('Error setting settings in database', err)
    })
    .then((data) => {
      store.update('userSettings', {
        defaultPostTime: prepTime,
        defaultPrepTime: postTime,
        defaultSnoozes: snoozes,
        defaultSnoozeTime: snoozeTime,
        defaultAlarmSound: alarmSound,
      })
    })
    .then(() => {
      this.props.navigation.state.params.updateUserSettings(prepTime, postTime, snoozes, snoozeTime, alarmSound)
    })
    .then(goBack)
    .catch((err) => {
      console.log('Error saving settings', err)
    });

  };

  toCalendarScreen() {
    let { navigate, state } = this.props.navigation;
    let { userId } = state.params;
     this.props.navigation.navigate('CalendarScreen', {
       userId,
     });
   }


  handleLogin() {
    let { goBack, state } = this.props.navigation;
    let { userId, saveSettings } = state.params;
    saveSettings(userId, () => {});
    Linking.openURL(`http://localhost:8082/auth/google?userId=${userId}`)
    .catch(err => console.error('An error occurred', err));
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
        <View></View>
        <View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', maxHeight: 40, width: 230 }}>
              <Text>Number of Snoozes: </Text>
              <ModalDropdown
                dropdownStyle={{ borderWidth: 1, borderColor: 'black' }}
                defaultIndex={this.state.snoozes}
                defaultValue={(this.state.snoozes) + " snoozes" || "Please select..."}
                options={[...Array(12)].map((x,i) => (i) + ` snooze${i===1 ? '' : 's'} `)}
                onSelect={(idx, val) => {
                  this.setState({ snoozes: parseInt(val) })
                }}
              />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', maxHeight: 40, width: 230 }}>
              <Text>Snooze Time: </Text>
              <ModalDropdown
                dropdownStyle={{ borderWidth: 1, borderColor: 'black' }}
                defaultIndex={this.state.snoozeTime}
                defaultValue={(this.state.snoozeTime) + " minutes" || "Please select..."}
                options={[...Array(16)].map((x,i) => (i || 0.5) + ` minute${i===1 ? '' : 's'}`)}
                onSelect={(idx, val) => {
                  this.setState({ snoozeTime: parseFloat(val) })
                }}
              />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', maxHeight: 40, width: 230 }}>
            <Text>Prep Time: </Text>
            <ModalDropdown
              dropdownStyle={{ borderWidth: 1, borderColor: 'black' }}
              defaultIndex={this.state.prepTime}
              defaultValue={(this.state.prepTime*5) + " minutes" || "Please select..."}
              options={[...Array(13)].map((x,i) => (i) * 5 + ' minutes ')}
              onSelect={(idx, val) => {
                this.setState({ prepTime: parseInt(val)/5 })
              }}
            />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', maxHeight: 40, width: 230, flexWrap: 'nowrap' }}>
            <View>
              <Text>Post-Travel Prep Time: </Text>
            </View>
            <View>
              <ModalDropdown
                dropdownStyle={{ borderWidth: 1, borderColor: 'black' }}
                defaultIndex={this.state.postTime}
                defaultValue={(this.state.postTime*5) + " minutes" || "Please select..."}
                options={[...Array(13)].map((x,i) => (i)*5 + ' minutes ')}
                onSelect={(idx, val) => {
                  this.setState({ postTime: parseInt(val)/5 })
                }}
              />
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', maxHeight: 40, width: 230, flexWrap: 'nowrap' }}>
            <View>
              <Text>Default Alarm Sound: </Text>
            </View>
            <View>
              <ModalDropdown
                dropdownStyle={{ borderWidth: 1, borderColor: 'black' }}
                defaultIndex={this.state.postTime}
                defaultValue={this.state.alarmSound}
                options={['annoying', 'alarmchi']}
                onSelect={(idx, val) => {
                  this.setState({ alarmSound: val })
                }}
              />
            </View>
          </View>
        </View>
        <View />
        <View> {
          this.state.token ? <Button title="Go to CalendarScreen" onPress={this.toCalendarScreen}></Button> : <Button title="Login" onPress={this.handleLogin}></Button>
        }
        </View>
      </View>
    );
  }
}

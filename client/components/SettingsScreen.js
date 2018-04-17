import React from 'react';
import BottomNavigation from './BottomNavigation';
import { Image, Button, View, Text, TextInput, Picker, StyleSheet, Linking } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import HeaderButton from 'react-navigation-header-buttons'
import Icon from 'react-native-vector-icons/Ionicons.js';
import axios from 'axios';
import store from 'react-native-simple-store';
import LinearGradient from 'react-native-linear-gradient';
import BottomToolbar from 'react-native-bottom-toolbar';
import Hr from 'react-native-hr-plus';
import logo from './image.png';
import FontAwesome, { Icons } from 'react-native-fontawesome';

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
        <HeaderButton IconComponent={Icon} iconSize={23} color="#f5f5f5">
          <HeaderButton.Item
            title="Done"
            buttonStyle={{
              fontWeight: 'bold',
              fontSize: 18,
            }}
            onPress={() => {
              params.saveSettings(params.userId, navigation.goBack)
            }}
          />
        </HeaderButton>
      ),
    }
  }


  componentWillMount() {
    this.props.navigation.setParams({ saveSettings: this._saveSettings });
    store.get('token').then((token) => {
      this.setState({token: token})
    })
  }

  componentDidMount() {
    Linking.addEventListener('url', this.handleOpenURL);
    let { userId } = this.props.navigation.state.params
    if (this.state.token) {
      axios.post("http://roryeagan.com:8082/auth/checktoken", {
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
      .catch(console.error('error in check token'))
    }
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  handleOpenURL(event) {
    let status = event.url.slice(15, 22)
    if (status === 'success') {
      store.save('token', true)
      .then(this.setState({token: true,}))
      .then(this.toCalendarScreen)
      let maxTime = `${new Date(Date.now() + 31536000000).toISOString().slice(0,10)}T00:00:00-01:00:00`
      let minTime = `${new Date(Date.now() - 5100000000).toISOString().slice(0,10)}T00:00:00-01:00:00`
      axios.get("http://roryeagan.com:8082/auth/calendar", {
        params: {
          userId: this.props.navigation.state.params.userId,
          minTime,
          maxTime,
        }
      })
      .then(({ data }) => {
        let eventsObj = {};
        data.forEach((evt) => {
          eventsObj[evt.id] = evt;
        })
        store.save('events', eventsObj)
      })
      .catch(console.log('Error in handleOpenURL'))
    } else if (status === 'failure'){
      store.save('token', false);
      this.setState({
        token: false,
      })
    }
  }



  _saveSettings = (userId, goBack) => {
    let { prepTime, postTime, snoozes, snoozeTime, alarmSound } = this.state;
    axios.post('http://roryeagan.com:8082/settings/save', {
      userId,
      prepTime,
      postTime,
      snoozes,
      snoozeTime,
      alarmSound,
    })
    .catch((err) => {
      console.error('Error setting settings in database', err)
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
    // .then(goBack)
    .catch((err) => {
      console.log('Error saving settings', err)
    });
    goBack();
  };

  toCalendarScreen() {
    let { navigate, state } = this.props.navigation;
    let { userId } = state.params;
    navigate('CalendarScreen', {
       userId,
       settings: this.state
     });
   }


  handleLogin() {
    let { goBack, state } = this.props.navigation;
    let { userId, saveSettings } = state.params;
    saveSettings(userId, () => {});
    Linking.openURL(`http://roryeagan.com:8082/auth/google?userId=${userId}`)
    .catch(err => console.error('An error occurred', err));
  }

  render() {
    console.log(this.state.alarmSound);
    return (
      <LinearGradient colors={['#8edee0', '#3ec6cb', '#7ad8db']} style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between'}}>
        <View></View>
        <View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', margin: 10,  alignItems: "center", maxHeight: 40, width: 300,  }}>
              <Text style = {{fontSize:16, color: '#164f51'}}>Number of Snoozes: </Text>
              <ModalDropdown
              textStyle={{fontSize:15, color: '#164f51'}}
                dropdownStyle={{ borderWidth: 1, borderColor: 'black', }}
                dropdownTextStyle = {{backgroundColor: '#33b8bd',}}
                defaultIndex={this.state.snoozes}
                defaultValue={(this.state.snoozes) + " snoozes" || "Please select..."}
                options={[...Array(12)].map((x,i) => (i) + ` snooze${i===1 ? '' : 's'} `)}
                onSelect={(idx, val) => {
                  this.setState({ snoozes: parseInt(val) })
                }}
              />
          </View>
          <Hr style = {{  height: 2, width: 350, opacity: 0.4,}}/>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', margin: 10, alignItems: "center", maxHeight: 40, width: 300 }}>
              <Text style = {{fontSize:16, color: '#164f51'}}>Snooze Time: </Text>
              <ModalDropdown
              textStyle={{fontSize:15, color: '#164f51', textAlignVertical: "auto", }}
                dropdownStyle={{ borderWidth: 1, borderColor: '#164f51' }}
                dropdownTextStyle = {{backgroundColor: '#33b8bd',}}
                defaultIndex={this.state.snoozeTime}
                defaultValue={(this.state.snoozeTime) + " minutes" || "Please select..."}
                options={[...Array(16)].map((x,i) => (i || 0.5) + ` minute${i===1 ? '' : 's'}`)}
                onSelect={(idx, val) => {
                  this.setState({ snoozeTime: parseFloat(val) })
                }}
              />
          </View>
          <Hr style = {{  height: 1, width: 350, opacity: 0.25,}}/>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between',margin: 10, alignItems: "center", maxHeight: 40, width: 300 }}>
            <Text style = {{fontSize:16, color: '#164f51'}}>Prep Time: </Text>
            <ModalDropdown
            textStyle={{fontSize:15, color: '#164f51'}}
              dropdownStyle={{ borderWidth: 1, borderColor: '#164f51' }}
              dropdownTextStyle = {{backgroundColor: '#33b8bd',}}
              defaultIndex={this.state.prepTime}
              defaultValue={(this.state.prepTime*5) + " minutes" || "Please select..."}
              options={[...Array(13)].map((x,i) => (i) * 5 + ' minutes ')}
              onSelect={(idx, val) => {
                this.setState({ prepTime: parseInt(val)/5 })
              }}
            />
          </View>

          <Hr style = {{  height: 1, width: 350, opacity: 0.25,}}/>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', margin: 10, alignItems: "center", maxHeight: 40, width: 300, flexWrap: 'nowrap' }}>
            <View>
              <Text style = {{fontSize:16, color: '#164f51'}}>Post-Travel Prep Time: </Text>
            </View>
            <View>
              <ModalDropdown
                textStyle={{fontSize:15, color: '#164f51'}}
                dropdownStyle={{ borderWidth: 1, borderColor: '#164f51',  }}
                dropdownTextStyle = {{backgroundColor: '#33b8bd',}}
                defaultIndex={this.state.postTime}
                defaultValue={(this.state.postTime*5) + " minutes" || "Please select..."}
                options={[...Array(13)].map((x,i) => (i)*5 + ' minutes ')}
                onSelect={(idx, val) => {
                  this.setState({ postTime: parseInt(val)/5 })
                }}
              />
            </View>
          </View>
          <Hr style = {{  height: 1, width: 350, opacity: 0.3,}}/>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', margin: 10, alignItems: "center", maxHeight: 40, width: 295, flexWrap: 'nowrap' }}>
            <View>
              <Text style = {{fontSize:16, color: '#164f51'}}>Default Alarm Sound: </Text>
            </View>
            <View>
              <ModalDropdown
              textStyle={{fontSize:15, color: '#164f51'}}
                dropdownStyle={{ borderWidth: 1, borderColor: '#164f51', height: 100 }}
                dropdownTextStyle = {{backgroundColor: '#33b8bd',}}
                defaultIndex={this.state.postTime}
                defaultValue={this.state.alarmSound}
                options={['annoying', 'alarmchi', 'eternity']}
                onSelect={(idx, val) => {
                  this.setState({ alarmSound: val })
                }}
              />
            </View>
          </View>
        </View>
        <View />
        <View>
        <Image
        style={{width: 150, height: 150, opacity: 0.7, marginBottom: 50}}
          source={require('./image.png')}
        />
        </View>
        <BottomToolbar
          wrapperStyle={{backgroundColor: '#33b8bd'}}
          textStyle={{fontWeight: '700'}}
          color="#f5f5f5"
          showIf={this.state.token}
        >
          <BottomToolbar.Action title=''/>
          <BottomToolbar.Action title=''/>
          <BottomToolbar.Action
            title="View your calendar"
            onPress={this.toCalendarScreen}
          />
          <BottomToolbar.Action
            IconComponent={Icon}
            iconName={"md-calendar"}
            title="Go to CalendarScreen"
            onPress={this.toCalendarScreen}
          />
          <BottomToolbar.Action title=''/><BottomToolbar.Action title=''/><BottomToolbar.Action title=''/><BottomToolbar.Action title=''/><BottomToolbar.Action title=''/>
        </BottomToolbar>
        <BottomToolbar
          wrapperStyle={{backgroundColor: '#33b8bd'}}
          textStyle={{fontWeight: '700'}}
          color="#f5f5f5"
          showIf={!this.state.token}
        >
          <BottomToolbar.Action title=''/><BottomToolbar.Action title=''/><BottomToolbar.Action title=''/>
          <BottomToolbar.Action
            title="Login to Google"
            onPress={this.handleLogin}
          />
          <BottomToolbar.Action
            IconComponent={Icon}
            iconName={"logo-google"}
            title="Login to Google"
            onPress={this.handleLogin}
          />
          <BottomToolbar.Action title=''/><BottomToolbar.Action title=''/><BottomToolbar.Action title=''/><BottomToolbar.Action title=''/><BottomToolbar.Action title=''/>
        </BottomToolbar>
      </LinearGradient>
    );
  }
}

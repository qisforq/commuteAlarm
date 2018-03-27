import React from 'react';
import BottomNavigation from './BottomNavigation';
import {Button, View, Text, TextInput, Picker, StyleSheet } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import HeaderButton from 'react-navigation-header-buttons'
import Icon from 'react-native-vector-icons/Ionicons.js';
import axios from 'axios';
import store from 'react-native-simple-store';


export default class SettingsScreen extends React.Component {
  constructor(props){
    super(props);
    console.log(props);
    this.state = {
      prepTime: props.navigation.state.params.userSettings.defaultPrepTime,
      postTime: props.navigation.state.params.userSettings.defaultPostTime,
      snoozes: props.navigation.state.params.userSettings.defaultSnoozes,
      snoozeTime: props.navigation.state.params.userSettings.defaultSnoozeTime,
    }
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
              params.saveSettings(params, navigation.goBack)
            }}
          />
        </HeaderButton>
      ),
    }
  }

  componentWillMount() {
    let {defaultPrepTime, defaultPostTime, defaultSnoozes} = this.props.navigation.state.params.userSettings;
    this.props.navigation.setParams({ saveSettings: this._saveSettings });
    // this.setState({
    //   prepTime: defaultPrepTime,
    //   postTime: defaultPostTime,
    //   snoozes: defaultSnoozes,
    // });
  }

  _saveSettings = ({userId}, goBack) => {
    let { prepTime, postTime, snoozes, snoozeTime } = this.state;
    axios.post('http://localhost:8082/settings/save', {
      userId: userId,
      prepTime,
      postTime,
      snoozes,
      snoozeTime,
    }).then(data => {
      store.update('userSettings', {
        defaultPostTime: prepTime,
        defaultPrepTime: postTime,
        defaultSnoozes: snoozes,
        defaultSnoozeTime: snoozeTime,
      })
    }).then(() => {
      this.props.navigation.state.params.updateUserSettings(prepTime, postTime, snoozes, snoozeTime)
    }).then(goBack);

  };

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
                options={[...Array(16)].map((x,i) => (i) + ` minute${i===1 ? '' : 's'}`)}
                onSelect={(idx, val) => {
                  this.setState({ snoozeTime: parseInt(val) })
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
        </View>
        <View />
      </View>
    );
  }
}
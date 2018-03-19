import React from 'react';
import BottomNavigation from './BottomNavigation';
import {Button, View, Text, TextInput, Picker, StyleSheet } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import HeaderButton from 'react-navigation-header-buttons'
import Icon from 'react-native-vector-icons/Ionicons.js';


export default class SettingsScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      prepTime: 0,
      postTime: 0,
      snoozes: 0,
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
              params.saveSettings(navigation)
            }}
          />
        </HeaderButton>
      ),
    }
  }

  componentWillMount() {
    this.props.navigation.setParams({ saveSettings: this._saveSettings });
  }

  _saveSettings = (nav) => {
    console.log("nav:", nav)
    nav.goBack();
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
        <View></View>
        <View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', maxHeight: 40, width: 300 }}>
              <Text>Number of Snoozes: </Text>
              <ModalDropdown
                defaultIndex={this.state.snoozes}
                defaultValue="Please select..."
                style={styles.dropdown_1}
                options={[...Array(12)].map((x,i) => (i) + ` snooze${i===1 ? '' : 's'}              `)}
              />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', maxHeight: 40, width: 300 }}>
            <Text>Prep Time: </Text>
            <ModalDropdown
              defaultIndex={this.state.prepTime}
              defaultValue="Please select..."
              style={styles.dropdown_1}
              options={[...Array(13)].map((x,i) => (i) * 5 + ' minutes               ')}
            />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', maxHeight: 40, width: 300, flexWrap: 'nowrap' }}>
            <View>
              <Text>Post-Travel Prep Time: </Text>
            </View>
            <View>
              <ModalDropdown
                defaultIndex={this.state.postTime}
                defaultValue="Please select..."
                options={[...Array(13)].map((x,i) => (i)*5 + ' minutes               ')}
              />
            </View>
          </View>
        </View>
        <BottomNavigation cur={2} nav={this.props.navigation}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dropdown_1: {

  },
});

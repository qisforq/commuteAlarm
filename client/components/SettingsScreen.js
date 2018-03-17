import React from 'react';
import BottomNavigation from './BottomNavigation';
import {Button, View, Text, TextInput, Picker, StyleSheet } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';

export default class SettingsScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      prepTime: 0,
      postTime: 0,
      snoozes: 0,
    }
  }
  static navigationOptions = {
    title: 'Settings',
    headerLeft: null,
  };
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
        <View></View>
        <View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', maxHeight: 40, width: 300 }}>
            <View>
              <ModalDropdown
                defaultIndex={this.state.snoozes}
                defaultValue="Number of Snoozes"
                style={styles.dropdown_1}
                options={[...Array(12)].map((x,i) => (i) + ` snooze${i===1?'':'s'}              `)}
              />
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', maxHeight: 40, width: 300 }}>
            <Text>Prep Time: {this.state.prepTime}  </Text>
            <ModalDropdown
              defaultIndex={this.state.prepTime}
              defaultValue="Default Prep Time"
              style={styles.dropdown_1}
              options={[...Array(12)].map((x,i) => (i)*5 + ' minutes               ')}
            />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', maxHeight: 40, width: 300 }}>
            <View>
              <ModalDropdown
                defaultIndex={this.state.postTime}
                defaultValue="Default Post-Travel Prep Time"
                options={[...Array(12)].map((x,i) => (i)*5 + ' minutes               ')}
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

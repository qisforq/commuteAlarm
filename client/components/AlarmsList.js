import React, { Component } from 'react';
import {
  Alert, Button,Switch,  View, Text, TouchableHighlight, AsyncStorage,
  Slider, FlatList, StyleSheet, ListItem, RefreshControl, PushNotificationIOS,
} from 'react-native';
import Swipeout from 'react-native-swipeout';
import { Button as Booton } from 'react-native-paper';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { switchChange } from '../alarmsListFunctions';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
// import { Switch } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    accent: 'yellow',
  },
};



function AlarmsList({ userId, userSettings, alarms, modifyAlarms, deleteAlarm, editScreen }) {

  let renderItem = ({ item, index }) => {
    if (item.onOff && item.time < Date.now()) {
      item.onOff = false
    }
    let swipeBtns = [{
      text: 'Delete',
      backgroundColor: 'red',
      onPress: () => { deleteAlarm(item); },
    }];
    return (
      <Swipeout
        right={swipeBtns}
        backgroundColor="transparent"
      >
        <View style={{ height: 75, borderWidth: 0.3, borderColor: 'black' }}>
          <TouchableHighlight underlayColor="lightblue" onPress={() => editScreen(item)}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 0.5 }} />
              <FontAwesome style={{ flex: 2, marginTop: 10, fontSize: 35 }}>{Icons.clockO}</FontAwesome>
              <View style={{ flex: 10 }}>
                <Text style={{ fontWeight: '800', fontSize: 16 }}>{item.label}<Text style={{ fontWeight: '400', fontSize: 12 }}> - {new Date(item.time).toDateString()}</Text></Text>
                <Text style={{}}>Arrival Time: {item.time > Date.now() ? new Date(item.time).toLocaleTimeString() : 'Already Passed'}</Text>
                <Text style={{}}>Alarm Time: {item.goOffTime ? new Date(item.goOffTime).toLocaleTimeString() : 'Not Set'}</Text>
                <Text style={{ fontWeight: '300' }}>{item.address.slice(0, 32)}...</Text>
              </View>
              <Switch
              color="red"
                style={{ flex: 2 }}
                tintColor="lightgrey"
                value={item.onOff}
                onValueChange={() => switchChange(item, userId, userSettings, modifyAlarms)}
              />
              <View style={{ flex: 0.5 }} />
            </View>
          </TouchableHighlight>
        </View>
      </Swipeout>
    );
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between'}}>
      <View style={{ height: '100%', width: '100%' }}>
        <FlatList
          data={alarms}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />

      </View>
    </View>
  );
}

export default AlarmsList;

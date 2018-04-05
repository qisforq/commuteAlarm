import React, { Component } from 'react';
import {
  Alert, Button,Switch,  View, Text, TouchableHighlight, AsyncStorage,
  Slider, FlatList, StyleSheet, ListItem, RefreshControl, PushNotificationIOS,
} from 'react-native';
import Swipeout from 'react-native-swipeout';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { switchChange } from '../alarmsListFunctions';
import store from 'react-native-simple-store';


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
    console.log(item);
    let onOffSeperate = item.onOff;
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
                value={onOffSeperate}
                onValueChange={() => {
                  store.get('alarms').then((alarms) => {
                    const newAlarms = Object.keys(alarms).map((k) => {
                      if (k === item.id) {
                        alarms[k].onOff = !item.onOff;
                        alarms[k].goOffTime = item.goOffTime;
                        if (item.goOffTime < Date.now()) {
                          alarms[k].onOff = false;
                          alarms[k].goOffTime = '';
                        }
                      }
                      alarms[k].id = k;
                      return alarms[k];
                    });
                    console.log('here');
                    modifyAlarms(newAlarms, false);
                    store.save('alarms', alarms);
                  });
                  switchChange(item, userId, userSettings, modifyAlarms)
                }}
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

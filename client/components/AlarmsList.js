import React, { Component } from 'react';
import {
  Alert, Button, Switch, View, Text, TouchableHighlight, AsyncStorage,
  Slider, FlatList, StyleSheet, ListItem, RefreshControl, PushNotificationIOS,
} from 'react-native';
import Swipeout from 'react-native-swipeout';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { switchChange } from '../alarmsListFunctions';


function AlarmsList({ userId, userSettings, alarms, modifyAlarms, deleteAlarm, editScreen }) {

  let renderItem = ({ item, index }) => {
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
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <View style={{ flex: 0.5 }} />
              <FontAwesome style={{ flex: 2, marginTop: 10, fontSize: 35 }}>{Icons.clockO}</FontAwesome>
              <View style={{ flex: 10 }}>
                <Text style={{ fontWeight: '800', fontSize: 16 }}>{item.label}<Text style={{ fontWeight: '400', fontSize: 12 }}> - {new Date(item.time).toDateString()}</Text></Text>
                <Text style={{}}>Arrival Time: {new Date(item.time).toLocaleTimeString()}</Text>
                <Text style={{}}>Alarm Time: {item.goOffTime ? new Date(item.goOffTime).toLocaleTimeString() : 'Not Set'}</Text>
                <Text style={{ fontWeight: '300' }}>{item.address.slice(0, 32)}...</Text>
              </View>
              <Switch
                style={{ flex: 2, marginTop: 10 }}
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

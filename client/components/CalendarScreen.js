import React, { Component } from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import {Agenda} from 'react-native-calendars';
import axios from 'axios';

export default class AddScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {}
    };

    this.loadItems = this.loadItems.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderEmptyDate = this.renderEmptyDate.bind(this);
  }

  static navigationOptions = {
    title: 'CalendarScreen',
  };

  componentWillMount() {
    // axios.get("http://localhost:8082/auth/calendar", {
    //   params: {
    //     userId: this.props.navigation.state.params.userId,
    //   }
    // }).then(({ data }) => {
    //   // this.setState({
    //   //   :
    //   // });

    //   data.forEach((event, i) => {

    //   })
    //   console.log(data, "This dot props dot navvv-ih-gay-shun dot state dot p'rams dot user-eye-dee!");
    // })
  }

  render() {
    return (
      <Agenda
        // the list of items that have to be displayed in agenda. If you want to render item as empty date
        // the value of date key kas to be an empty array []. If there exists no value for date key it is
        // considered that the date in question is not yet loaded
        items={this.state.items}
        // callback that gets called when items for a certain month should be loaded (month became visible)
        loadItemsForMonth={this.loadItems}
        // initially selected day
        selected={'2017-05-16'}
        // specify how each item should be rendered in agenda
        renderItem={this.renderItem}
        // specify how empty date content with no items should be rendered
        renderEmptyDate={this.renderEmptyDate}
        // specify your item comparison function for increased performance
        rowHasChanged={this.rowHasChanged.bind(this)}

         // callback that fires when the calendar is opened or closed
         onCalendarToggled={(calendarOpened) => {console.log(calendarOpened)}}
         // callback that gets called on day press
         onDayPress={(day)=>{console.log('day pressed')}}
         // callback that gets called when day changes while scrolling agenda list
         onDayChange={(day)=>{console.log('day changed')}}
         // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
         minDate={'2017-05-10'}
         // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
         maxDate={'2018-03-30'}
         // Max amount of months allowed to scroll to the past. Default = 50
         pastScrollRange={10}
         // Max amount of months allowed to scroll to the future. Default = 50
         futureScrollRange={3}
         // specify how each date should be rendered. day can be undefined if the item is not first in that day.
         // renderDay={(day, item) => {
         //   if (!day) day = {dateString: 'fuck off'}
         //   return <View><Text>{day.dateString}</Text></View>}}
         // // specify how agenda knob should look like
         // renderKnob={() => <View><Text>this was rendered by...renderKnob!</Text></View>}
         // // specify what should be rendered instead of ActivityIndicator
         // renderEmptyData = {() => <View><Text>this was rendered by...renderEmptyData!</Text></View>}
         // // specify your item comparison function for increased performance
         rowHasChanged={(r1, r2) => {return r1.text !== r2.text}}
         // Hide knob button. Default = false
         hideKnob={false}
         // By default, agenda dates are marked if they have at least one item, but you can override this if needed
         // markedDates={{
         //   '2018-06-16': {selected: true, marked: true},
         //   '2018-06-17': {marked: true},
         //   '2018-06-18': {disabled: true},
         // }}
      />
    );
  }

  loadItems(day) {
    // NOTE: THIS FUNCTION IS GENERATING FAKE CALENDAR EVENTS
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
          const numItems = Math.floor(Math.random() * 5);
          for (let j = 0; j < numItems; j++) {
            this.state.items[strTime].push({
              name: 'Item for ' + strTime,
              height: Math.max(50, Math.floor(Math.random() * 150))
            });
          }
        }
      }
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
      this.setState({
        items: newItems
      }, console.log(this.state, "YIPPEEE AYE YAY"));
    }, 1000);
  }

  renderItem(item) {
    // console.log('THIS IS THE renderItem FUNCTION. Here is the item rendered:', item)
    return (
      <View style={[styles.item, {height: item.height*1.5}]}>
        <Text>{item.name} HAHAHAHAHAHA =D</Text>
        <Button title="add to alarms" onPress={() => console.log('You pressed me! =D')}></Button>
      </View>
    );
  }

  renderEmptyDate() {
    // console.log('THIS IS THE renderEmptyDate FUNCTION.')
    return (
      <View style={styles.emptyDate}><Text>This is empty date!</Text></View>
    );
  }

  rowHasChanged(r1, r2) {
    // NOTE: THIS FUNCTION updates the modules' shouldComponentUpdate function, so it needs to return either TRUE or FALSE
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'pink',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex:1,
    paddingTop: 30
  }
});

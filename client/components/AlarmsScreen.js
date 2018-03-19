import React from 'react';
import axios from 'axios';
import BottomNavigation from './BottomNavigation';
import { Alert, Button, View, Text, AsyncStorage, Slider, FlatList, StyleSheet, ListItem, RefreshControl } from 'react-native';
import dummyData from '../../server/dummyData';
import store from 'react-native-simple-store';
import FontAwesome, { Icons } from 'react-native-fontawesome';
export default class AlarmssScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      first: false,
      data: dummyData.alarms
    };
    this.renderItem = this.renderItem.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderSeparator = this.renderSeparator.bind(this);
    this.renderAdd = this.renderAdd.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
  }

  static navigationOptions = {
    title: 'Alarms',
    headerLeft: null,
  };

renderAdd() {
  this.props.navigation.navigate('SettingsScreen', {
            data: this.state.data
          })
}

renderItem(data) {
    let { item, index } = data;
    return (
      <View style={styles.itemBlock}>
        <FontAwesome style={styles.itemImage}>{Icons.clockO}</FontAwesome>
        <View style={styles.itemMeta}>
          <Text onPress = {this.renderAdd.bind(this)} style={styles.itemName}>{item.label}</Text>
          <Text style={styles.itemTime}>{item.time}</Text>
          <Text style={styles.itemLocation}>{item.location}</Text>
        </View>
      </View>
    ) 
  }

renderHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>Alarms</Text>
    </View>
  )
}

renderSeparator() {
  return <View style={styles.separator} />
}

_onRefresh() {
  this.setState({
    refreshing: true
  })
  setTimeout(function() {
    this.setState({
      refreshing: false
    })
  }.bind(this),1000)
}

componentDidMount() {
  store.get('userId').then(id => {
    if (id === null) {
      axios.get('http://localhost:8082/user/new').then((data) => {
        store.save('userId', data.data)
        store.save('alarms', {})
        this.setState({
          userId: data.data,
          first: true,
        }, () => {
          this.props.navigation.navigate('SettingsScreen', {
            userId: this.state.userId,
          });
        });
      });
    } else {
      this.setState({
        userId: id,
      });
    }
  });
}

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
        <View></View>
      <FlatList 
        keyExtractor={this._keyExtractor}
        data={this.state.data}
        renderItem={this.renderItem.bind(this)}
        ItemSeparatorComponent={this.renderSeparator.bind(this)}
        ListHeaderComponent={this.renderHeader.bind(this)}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }        
      />
        )}
      />
        <BottomNavigation userId={this.state.userId} cur={1} nav={this.props.navigation}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  itemBlock: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 0,
  },
  itemMeta: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 20,
  },
  itemLocation: {
    fontSize: 12,
    color: "#111",
  },
  itemTime: {
    fontSize: 14,
    color: "#111",
  },
  separator: {
    height: 0.5,
    width: "200%",
    alignSelf: 'center',
    backgroundColor: "#555"
  },
  header: {
    padding: 10,
    alignSelf: 'center'
  },
  headerText: {
    fontSize: 30,
    fontWeight: '900'
  }
});
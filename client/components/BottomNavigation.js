import React from 'react';
import {Button, View, Text, StyleSheet } from 'react-native';


export default class Navigation extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'music', title: 'Music', icon: 'queue-music' },
      { key: 'albums', title: 'Albums', icon: 'album' },
      { key: 'recents', title: 'Recents', icon: 'history' },
    ],
  };

  _handleIndexChange = index => this.setState({ index });

  _renderScene = BottomNavigation.SceneMap({
    music: MusicRoute,
    albums: AlbumsRoute,
    recents: RecentsRoute,
  });

  render() {
    return (
      <BottomNavigation
        navigationState={this.state}
        onIndexChange={this._handleIndexChange}
        renderScene={this._renderScene}
      />
    );
  }
}

// export default class BottomNavigation extends React.Component {
//   render() {
//     return (
//       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', maxHeight: 70 }}>
//         <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', maxHeight: 30 }}>
//           {this.props.cur !== 1 ?
//             <Button
//               title="Alarms Screen"
//               onPress={() => this.props.nav.navigate('AlarmsScreen', {
//                 userId: this.props.userId
//               })}
//             />:
//             ''}
//           {this.props.cur !== 2 ?
//             <Button
//               title="Settings Screen"
//               onPress={() => this.props.nav.navigate('SettingsScreen', {
//                 userId: this.props.userId,
//                 userSettings: this.props.userSettings,
//                 updateUserSettings: this.props.updateUserSettings,
//               })}
//             />:
//             ''}
//           {this.props.cur !== 3 ?
//             <Button
//               title="Edit/Add Screen"
//               onPress={() => this.props.nav.navigate('AddScreen', {
//                 userId: this.props.userId
//               })}
//             />:
//             ''}
//         </View>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   button: {
//   },
// });

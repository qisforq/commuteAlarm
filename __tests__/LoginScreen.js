import 'react-native';
import React from 'react';
import LoginScreen from '../client/components/LoginScreen';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

import {shallow, mount, render} from 'enzyme';

it('renders correctly', () => {
  const tree = renderer.create(
    <LoginScreen />
  ).toJSON();
  expect(LoginScreen).toMatchSnapshot();
});

// it(`should redirect to SettingsScreen if it is user's first time`, () => {
//
// })

// it(`on componentDidMount, should run AsyncStorage`, () => {
//
// })

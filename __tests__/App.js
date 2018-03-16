import 'react-native';
import React from 'react';
import App from '../client/components/App';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

import {shallow, mount, render} from 'enzyme';

it('renders correctly', () => {
  const tree = renderer.create(
    <App />
  ).toJSON();
  expect(App).toMatchSnapshot();
});

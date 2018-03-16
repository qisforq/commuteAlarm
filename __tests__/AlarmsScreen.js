import 'react-native';
import React from 'react';
import AlarmsScreen from '../client/components/AlarmsScreen';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(
    <AlarmsScreen />
  ).toJSON();
  expect(AlarmsScreen).toMatchSnapshot();
});

import 'react-native';
import {shallow, mount, render} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import AlarmsScreen from '../client/components/AlarmsScreen';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

// it('renders correctly', () => {
//   const tree = renderer.create(
//     <AlarmsScreen />
//   ).toJSON();
//   expect(AlarmsScreen).toMatchSnapshot();
// });


describe('Testing AlarmsScreen component with Enzyme', () => {
  it('renders correctly', () => {
    const wrapper = mount(
      <AlarmsScreen />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
})

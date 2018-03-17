import 'react-native';
import React from 'react';
import AlarmsScreen from '../client/components/AlarmsScreen';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import toJson from 'enzyme-to-json';
// it('renders correctly', () => {
//   const tree = renderer.create(
//     <AlarmsScreen />
//   ).toJSON();
//   expect(AlarmsScreen).toMatchSnapshot();
// });


describe('Testing AlarmsScreen component with Enzyme', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <AlarmsScreen />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
})

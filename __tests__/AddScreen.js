import 'react-native';
import {shallow, mount, render} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import AddScreen from '../client/components/AddScreen';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';


describe('Testing AddScreen component with Enzyme', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <AddScreen />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
})

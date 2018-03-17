import 'react-native';
import {shallow, mount, render} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import App from '../client/components/App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('../node_modules/react-native-simple-store',() => ({
  save: jest.fn(),
  get: jest.fn(),
}));

// it('renders correctly', () => {
//   const tree = renderer.create(
//     <App />
//   ).toJSON();
//   expect(App).toMatchSnapshot();
// });


describe('Testing App component with Enzyme', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <App />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
})

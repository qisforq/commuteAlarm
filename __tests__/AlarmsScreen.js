import 'react-native';
import {shallow, mount, render} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import AlarmsScreen from '../client/components/AlarmsScreen';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
// ~~~Mock Function for react-native-store~~~
// const mockValues = {
// 	arrayOne: JSON.stringify(['red', 'blue']),
// 	objectOne: JSON.stringify({
// 		isATest: true,
// 		hasNestedData: {
// 			ohYeah: 'it\'s true',
// 		}
// 	}),
// 	stringOne: JSON.stringify('testing string'),
// };
// jest.mock('../node_modules/react-native-simple-store',() => ({
//   save: jest.fn(() => {
//     return new Promise((resolve) => {
//       resolve(null);
//     });
//   }),
//   get: jest.fn((key) => {
//     return new Promise((resolve) => {
//       if (mockValues[key]) {
//         resolve(mockValues[key]);
//       } else {
//         resolve(null);
//       }
//     });
//   }),
// }));

describe('Testing AlarmsScreen component with Enzyme', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <AlarmsScreen />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe('Testing AlarmScreen state', () => {
  it('userId should be null', () => {
    const wrapper = shallow(
      <AlarmsScreen />
    );
    expect(wrapper.state('userId')).toBe(null);
  });

  // it('', () => {
  //   const wrapper = shallow(
  //     <AlarmsScreen />
  //   );
  //   expect()
  // });

});

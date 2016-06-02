import React from 'react';
import expect from 'expect';
import {shallow} from 'enzyme';
import NavigationComponent from '../../src/components/Navigation/index.jsx';

describe('Navigation Component', () => {
  const component = shallow(<NavigationComponent />);
  it('Should be a "nav" element.', () => {
    expect(component.is('nav')).toEqual(true);
  });
});
//
// test.beforeEach('Create component', t => {
//   t.context.component = shallow(<NavigationComponent />);
// });
//
// test('has a nav element', t => {
//   t.true(t.context.component.is('nav'));
// });
//
// test('contains a list', t => {
//   t.true(
//     t.context.component.find('ul').children().length > 0
//   );
// });

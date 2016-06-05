import React from 'react';
import expect from 'expect';
import {shallow} from 'enzyme';
import NavigationComponent from '../../src/components/Navigation.jsx';

describe('Navigation Component', () => {
  let component;
  beforeEach(() => {
    component = shallow(<NavigationComponent />);
  });

  it('Should be a "nav" element.', () => {
    expect(component.is('nav')).toEqual(true);
  });

  it('Should contain an <ul>', () => {
    expect(component.find('ul').children().length)
      .toBeGreaterThan(0);
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

import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import NavigationComponent from './';

test.beforeEach('Create component', t => {
  t.context.component = shallow(<NavigationComponent />);
});

test('has a nav element', t => {
  t.true(t.context.component.is('nav'));
});

test('contains a list', t => {
  t.true(
    t.context.component.find('ul').children().length > 0
  );
});

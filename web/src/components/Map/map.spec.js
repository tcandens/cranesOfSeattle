import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import MapComponent from './';

test.beforeEach('Create component', t => {
  t.context.component = shallow(<MapComponent />);
});

test('Map', t => {
  t.true(
    t.context.component.is('mapbox-gl-container')
  );
});

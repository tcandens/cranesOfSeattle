import React from 'react';
import expect from 'expect';
import {shallow} from 'enzyme';
import MapComponent from '../../src/components/Map.jsx';

let component;

beforeEach(() => {
  component = shallow(<MapComponent />);
});

describe('Map Component', () => {
  it('should have a specific class', () => {
    expect(component.hasClass('mapbox-gl-container')).toEqual(true);
  });
});

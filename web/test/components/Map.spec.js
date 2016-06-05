import React from 'react';
import expect from 'expect';
import {shallow, mount, render} from 'enzyme';
import MapComponent from '../../src/components/Map.jsx';

require('dotenv').config('../../.env');

const {MAPBOX_TOKEN} = process.env;
const MAPBOX_STYLE = 'mapbox://styles/mapbox/streets-v8';
const defaultProps = {
  accessToken: 'mapbox-secret',
  style: MAPBOX_STYLE,
  center: [42, 42],
};

describe('Map Component', function () {
  it('should have an inital state', function () {
    const component = shallow(<MapComponent {...defaultProps} />);
    expect(component.state('loaded')).toBe(false);
    expect(component.state('sources')).toEqual({});
  });

  it('should have a specific class', function () {
    const component = shallow(<MapComponent {...defaultProps} />);
    expect(component.hasClass('mapbox-gl-container')).toEqual(true);
  });

  const testSource = {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [42, 42],
          },
        },
      ],
    },
  };
  const testLayers = [
    {
      source: 'testSource',
      name: 'testSource',
      type: 'circle',
    },
  ];
  it.skip('should defer the setting of sources and styles to onLoad', function (done) {
    this.timeout(10000);
    const component = mount(
      <MapComponent {...defaultProps}
        sources={{testSource}}
        layers={testLayers}
        actions={{
          click: (map, data) => {
            console.log(map);
          },
          load: (map, data) => {
            expect(component.state('loaded')).toEqual(true);
            expect(component.state('sources')).toInclude(testSource);
            expect(map.getSource('testSource')).toExist();
          },
        }}
      />
    );
    done();
  });
});

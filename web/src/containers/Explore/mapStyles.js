import config from '../../config/colors.json';
const {$colors} = config;

export function createSources({reports, cranes}) {
  return {
    reports: {
      type: 'geojson',
      data: reports,
      cluster: true,
      maxzoom: 18,
      clusterMaxZoom: 17,
      clusterRadius: 30,
    },
    cranes: {
      type: 'geojson',
      data: cranes,
      maxzoom: 20,
      cluster: false,
    },
  };
}

export const layers = [
  {
    id: 'report-cluster-big',
    source: 'reports',
    type: 'circle',
    paint: {
      'circle-color': $colors.mint,
      'circle-radius': 60,
      'circle-blur': 1.5,
    },
    filter: ['>=', 'point_count', 4],
  },
  {
    id: 'report-cluster',
    source: 'reports',
    type: 'circle',
    paint: {
      'circle-color': $colors.salmon,
      'circle-radius': 60,
      'circle-blur': 1.5,
    },
    filter: ['<=', 'point_count', 3],
  },
  {
    id: 'reports--high',
    source: 'reports',
    type: 'circle',
    paint: {
      'circle-color': $colors.mint,
      'circle-radius': 15,
      'circle-blur': 0.2,
    },
    filter: ['>', 'confidence', 2],
  },
  {
    id: 'reports--low',
    source: 'reports',
    type: 'circle',
    paint: {
      'circle-color': $colors.yellow,
      'circle-radius': 50,
      'circle-blur': 1.5,
    },
    filter: ['<=', 'confidence', 2],
  },
  {
    id: 'cranes',
    source: 'cranes',
    type: 'symbol',
    layout: {
      'icon-image': 'cranes',
      'icon-offset': [-10, -10],
    },
  },
];

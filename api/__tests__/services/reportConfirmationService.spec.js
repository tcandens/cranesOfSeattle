import test from 'ava';
import reportModel from '../../src/resources/reports/model';
import {
  getNearbyPermits,
  getNearbyReports,
} from '../../src/services/reportConfirmationService';

const reportLocation = {
  longitude: -122.3868,
  latitude: 47.6825
}

function seedReports() {
  for (let i = 0; i <= 5; i++) {
    const plusOrMinus = () => Math.random() < 0.5 ? -1 : 1;
    const scatterLng = reportLocation.longitude + (Math.random() / 10000 * plusOrMinus());
    const scatterLat = reportLocation.latitude + (Math.random() / 10000 * plusOrMinus());
    reportModel.create({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          scatterLng,
          scatterLat
        ]
      },
      properties: {
        'user_id': i
      }
    })
  }
}
function clearReports() {
  reportModel.__destroyAll__();
}

// test.beforeEach('Seed Reports', seedReports);
// test.afterEach('Clear Reports', clearReports);

test('#getNearbyPermits', t => {
  seedReports();
  t.plan(1);
  getNearbyPermits(reportLocation).then(nearbyPermits => {
    console.log(nearbyPermits)
    clearReports();
    t.true((nearbyPermits.length > 0));
  }).catch(error => {
    clearReports();
    t.fail();
  })
});

test.skip('#getNearbyReports', t => {

});

test.skip('#calculateReportConfidence', t => {

});

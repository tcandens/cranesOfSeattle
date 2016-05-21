import test from 'ava';
import reportModel from '../../src/resources/reports/model';
import {
  getNearbyPermits,
  calculateConfidence,
} from '../../src/services/reportConfirmationService';

const report = {
  longitude: -122.3868,
  latitude: 47.6825
}

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

test.skip('#calculateConfidence', t => {

});

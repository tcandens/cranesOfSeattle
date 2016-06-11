import Promise from 'bluebird';

import * as getNearby from './nearbyResources';
import calculateConfidence from './calculateConfidence';
import respondToConfidence from './respondToConfidence';

export default async function confirmReport(report) {
  const nearbyPermits = await getNearby.permits(report);
  const nearbyReports = await getNearby.reports(report);
  const nearbyCranes = await getNearby.cranes(report);
  const confidence = calculateConfidence(
    report,
    nearbyReports,
    nearbyPermits,
    nearbyCranes,
  );
  const response = await respondToConfidence(confidence, report, {
    reports: nearbyReports,
    permits: nearbyPermits,
    cranes: nearbyCranes
  })
  return Promise.resolve(response)
};

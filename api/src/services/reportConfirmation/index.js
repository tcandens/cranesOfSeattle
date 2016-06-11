import Promise from 'bluebird';

import * as getNearby from './nearbyResources';
import calculateConfidence from './calculateConfidence';
import respondToConfidence from './respondToConfidence';

export default async function confirmReport(report) {
  let nearbyPermits;
  let nearbyCranes;
  let nearbyReports;
  try {
    nearbyPermits = await getNearby.permits(report);
    nearbyReports = await getNearby.reports(report);
    nearbyCranes = await getNearby.cranes(report);
  } catch (error) {
    console.error(error)
  }
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

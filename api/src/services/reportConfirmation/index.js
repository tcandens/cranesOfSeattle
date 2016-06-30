import Promise from 'bluebird';

import * as getNearby from './nearbyResources';
import calculateConfidence from './calculateConfidence';
import respondToConfidence from './respondToConfidence';

export default async function confirmReport(report) {
  const nearbyReports = await getNearby.reports(report);
  const userReports = getNearby.findUserReports(report, nearbyReports.features);
  // if user already has reports nearby, short circut
  if (userReports.length > 0) {
    return Promise.resolve({
      message: 'Report was not created. You have already made reports nearby.'
    });
  } else {
    const uniqueReports = getNearby.filterUniqueById(
      report.properties.user_id,
      nearbyReports.features
    );
    const nearbyPermits = await getNearby.permits(report);
    const nearbyCranes = await getNearby.cranes(report);
    const confidence = calculateConfidence(
      report,
      uniqueReports,
      nearbyPermits,
      nearbyCranes,
    );
    const response = await respondToConfidence(confidence, report, {
      reports: nearbyReports,
      permits: nearbyPermits,
      cranes: nearbyCranes
    })
    return Promise.resolve(response)
  }
};

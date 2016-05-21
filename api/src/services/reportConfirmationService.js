import Promise from 'bluebird';
import geolib from 'geolib';
import permitModel from '../resources/permits/model';
import reportModel from '../resources/reports/model';
import defaults from 'lodash/defaults';

const radius = 500;

export function getNearbyPermits(report, opt) {
  const options = defaults({}, opt, {
    radius
  });
  return permitModel.fetchAll().then(permits => {
    return permits.filter(permit => {
      const {longitude, latitude} = permit;
      const reportLng = report.geometry.coordinates[1];
      const reportLat = report.geometry.coordinates[0];
      return geolib.isPointInCircle(
        {latitude: longitude, longitude: latitude},
        {latitude: reportLat, longitude: reportLng},
        options.radius
      )
    })
  })
}

export function getNearbyReports(report, opt) {
  const options = defaults({}, opt, {
    radius
  });
  return reportModel.findWithin({
    lng: report.geometry.coordinates[0],
    lat: report.geometry.coordinates[1],
    radius: options.radius
  });
}

export function filterUniqueId(id, reports) {
  if (reports.features === null) {
    return [];
  }
  const filtered = reports.features.filter(report => {
    if (!report.properties || !report.properties['user_id']) {
      return false;
    }
    report.properties['user_id'] !== id;
  });
  return filtered;
}

export function calculateConfidence(report, reports, permits) {
  let confidence;
  if (reports.length > 0 && permits.length > 0) {
    console.log('Nearby reports and permits')
    confidence = 4;
  } else if (reports.length > 0 && permits.length === 0) {
    console.log('Nearby reports but no permits')
    confidence = 3;
  } else if (reports.length === 0 && permits.length > 0) {
    console.log('No nearby reports but nearby permits')
    confidence = 2;
  } else if (reports.length === 0 && permits.length === 0) {
    console.log('No reports or permits nearby')
    confidence = 1;
  }
  return confidence;
}

export default Promise.coroutine(function* confirmReport(report) {
  const nearbyPermits = yield getNearbyPermits(report);
  const nearbyReports = yield getNearbyReports(report).then(nearbyReports => {
    return filterUniqueId(report.properties['user_id'], nearbyReports)
  });
  const confidence = calculateConfidence(
    report,
    nearbyReports,
    nearbyPermits
  );
  report.properties.confidence = confidence;
  const saved = yield reportModel.create(report);
  saved.properties.nearbyPermits = nearbyPermits;
  return saved;
});

import Promise from 'bluebird';
import geolib from 'geolib';
import permitModel from '../resources/permits/model';
import reportModel from '../resources/reports/model';
import craneModel from '../resources/cranes/model';
import defaults from 'lodash/defaults';

const RADIUS_TO_SEARCH_IN_METERS = 500;

export function getNearbyCranes(report, opt) {
  const options = defaults({}, opt, {
    radius: RADIUS_TO_SEARCH_IN_METERS
  });
  return craneModel.findWithin({
    lng: report.geometry.coordinates[0],
    lat: report.geometry.coordinates[1],
    radius: options.radius
  });
}

export function getNearbyPermits(report, opt) {
  const options = defaults({}, opt, {
    radius: RADIUS_TO_SEARCH_IN_METERS
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
    });
  });
}

export function getNearbyReports(report, opt) {
  const options = defaults({}, opt, {
    radius: RADIUS_TO_SEARCH_IN_METERS
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

export function calculateConfidence(report, reports, permits, cranes) {
  let confidence;
  if (cranes.length > 0) {
    confidence = 4;
  } else if (reports.length > 0 && permits.length > 0) {
    confidence = 3;
  } else if (reports.length > 0 && permits.length === 0) {
    confidence = 2;
  } else if (reports.length === 0 && permits.length > 0) {
    confidence = 1;
  } else if (reports.length === 0 && permits.length === 0) {
    confidence = 0;
  }
  return confidence;
}

export function respondToConfidence(confidence, report, nearbyEntities) {
  switch (confidence) {
    case 0:
    case 1:
    case 2:
      return {
        message: `Report created with confidence of ${confidence}.`,
        result: reportModel.create(Object.assign({}, report, {
          properties: {
            ...report.properties,
            confidence
          }
        }))
      }
    case 3:
      let nearestPermit = geolib.findNearest({
        latitude: report.geometry.latitude,
        longitude: report.geometry.longitude
      }, nearbyEntities.permits);
      return {
        message: 'Crane and report created.',
        result: {
          report: reportModel.create(Object.assign({}, report, {
            properties: {
              ...report.properties,
              confidence
            }
          })),
          crane: craneModel.create({
            geometry: [nearestPermit.longitude, nearestPermit.latitude],
            user_id: report.properties.user_id,
            permit: nearestPermit,
            expiration_date: nearestPermit.expiration_date,
            address: nearestPermit.address
          })
        }
      }
    case 4:
      const nearestCrane = geolib.findNearest({
        latitude: report.geometry.latitude,
        longitude: report.geometry.longitude
      }, nearbyEntities.cranes.map(crane => ({
        latitude: crane.geometry.latitude,
        longitude: crane.geometry.longitude,
        geometry: crane.geometry,
        properties: crane.properties
      })));
      return {
        message: 'Updated confidence of nearest crane.',
        result: craneModel.update({
          id: nearestCrane.properties.id,
          confidence: nearestCrane.properties.confidence + report.properties.confidence
        })
      }
  }
}

export default Promise.coroutine(function* confirmReport(report) {
  const nearbyPermits = yield getNearbyPermits(report);
  const nearbyReports = yield getNearbyReports(report).then(nearbyReports => {
    return filterUniqueId(report.properties['user_id'], nearbyReports)
  });
  const nearbyCranes = yield getNearbyCranes(report);
  const confidence = calculateConfidence(
    report,
    nearbyReports,
    nearbyPermits,
    nearbyCranes,
  );
  const response = yield respondToConfidence(confidence, report, {
    reports: nearbyReports,
    permits: nearbyPermits,
    cranes: nearbyCranes
  })
  return response;
});

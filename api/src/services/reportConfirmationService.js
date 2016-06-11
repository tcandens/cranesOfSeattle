import Promise from 'bluebird';
import geolib from 'geolib';
import permitModel from '../resources/permits/model';
import reportModel from '../resources/reports/model';
import craneModel from '../resources/cranes/model';
import defaults from 'lodash/defaults';

const RADIUS_TO_SEARCH_IN_METERS = 500;

/**
 * Retrieves and filters cranes to within a given radius of report.
 * @param  {GeoJSON} Report - User report with geometry and properties.
 * @param  {Objec} Opt - Options object.
 * @param  {Number} Opt.radius - search radius in meters.
 * @return {Array} A promise that returns an array
 *  of nearby cranes as GeoJSON features.
 */
export async function getNearbyCranes(report, opt) {
  const options = defaults({}, opt, {
    radius: RADIUS_TO_SEARCH_IN_METERS
  });
  const cranesCollection = await craneModel.findWithin({
    lng: report.geometry.coordinates[0],
    lat: report.geometry.coordinates[1],
    radius: options.radius
  })
  return cranesCollection.features || [];
}

/**
 * Retrieves and filters permits to within a given radius of report.
 * @param  {geoJSON} User report with geometry and properties.
 * @param  {Object} Opt - Options object.
 * @param  {Number} Opt.radius - search radius in meters.
 * @return {Promise.<Array>} A promise the returns an array of permit objects.
 */
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

/**
 * Retrieve and filters reports against radius and user_id
 * @param  {GeoJSON} User report with geometry and properties['user_id'].
 * @param  {Object} Opt - Options object.
 * @param  {Number} Opt.radius - Search radius in meters.
 * @return {Promise.<Array>} - A promise that returns an array of nearby
 * reports as GeoJSON features.
 */
export async function getNearbyReports(report, opt) {
  const options = defaults({}, opt, {
    radius: RADIUS_TO_SEARCH_IN_METERS
  });
  const reportsCollection = reportModel.findWithin({
    lng: report.geometry.coordinates[0],
    lat: report.geometry.coordinates[1],
    radius: options.radius
  })
  return reportsCollection.features || [];
}

export function filterUniqueId(id, reports) {
  if (reports.length === 0) {
    return [];
  }
  const filtered = reports.filter(report => {
    if (!report.properties || !report.properties['user_id']) {
      return false;
    }
    return report.properties['user_id'] !== id;
  });
  return filtered;
}

/**
 * Calculate the appropriate level of confidence for submitted report
 * as determined by nearby reports, permits, and cranes.
 * @param  {Object} User report GeoJSON object.
 * @param  {Array} Reports - Collection of nearby reports.
 * @param  {Array} Permits - Collection of nearby permits.
 * @param  {Array} Cranes - Collection of nearby cranes.
 * @return {Number|Integer} The confidence index of report: range {0...4}
 */
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

/**
 * Executes correct actions for given confidence of report.
 * @param  {Number} confidence - see #calculateConfidence.
 * @param  {GeoJSON} report - User report.
 * @param  {Object} nearbyEntities - Hash of nearby entities.
 * @param  {Array} nearbyEntities.reports - see #getNearbyReports.
 * @param  {Array} nearbyEntities.permits - see #getNearbyPermits.
 * @param  {Array} nearbyEntities.cranes - see #getNearbyCranes.
 * @return {Object} With message.<String> and result.<Object>.
 */
export async function respondToConfidence(confidence, report, nearbyEntities) {
  let createdReport, createdCrane, nearestPermit;
  switch (confidence) {
    case 0:
    case 1:
    case 2:
      createdReport = await reportModel.create(Object.assign({}, report, {
        properties: {
          ...report.properties,
          confidence
        }
      }));
      return {
        message: `Report created with confidence of ${confidence}.`,
        result: createdReport
      }
    case 3:
      nearestPermit = geolib.findNearest({
        longitude: report.geometry.coordinates[0],
        latitude: report.geometry.coordinates[1]
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
            // Geometry must be a GeoJSON point
            geometry: {
              type: 'Point',
              coordinates: [nearestPermit.longitude, nearestPermit.latitude]
            },
            properties: {
              user_id: report.properties.user_id,
              permit: nearestPermit,
              expiration_date: nearestPermit.expiration_date,
              address: nearestPermit.address,
              confidence: confidence
            }
          })
        }
      }
    case 4:
      const nearestCrane = geolib.findNearest({
        longitude: report.geometry.coordinates[0],
        latitude: report.geometry.coordinates[1]
      }, nearbyEntities.cranes.map(crane => ({
          longitude: crane.geometry.coordinates[0],
          latitude: crane.geometry.coordinates[1],
          geometry: crane.geometry,
          properties: crane.properties
      })));
      createdCrane = await craneModel.update({
        id: nearestCrane.properties.id,
        confidence: nearestCrane.properties.confidence + report.properties.confidence
      });
      return {
        message: 'Updated confidence of nearest crane.',
        result: createdCrane
      }
  }
}

import {inspect} from 'util';
export default async function confirmReport(report) {
  let nearbyPermits;
  let nearbyCranes;
  let nearbyReports;
  try {
    nearbyPermits = await getNearbyPermits(report);
    nearbyReports = await getNearbyReports(report);
    nearbyCranes = await getNearbyCranes(report);
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

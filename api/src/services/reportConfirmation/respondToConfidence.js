import geolib from 'geolib';
import reportModel from '../../resources/reports/model';
import craneModel from '../../resources/cranes/model';

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
export default async function respondToConfidence(confidence, report, nearbyEntities) {
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
        result: {
          report: createdReport,
          crane: null
        }
      }
    case 3:
      nearestPermit = geolib.findNearest({
        longitude: report.geometry.coordinates[0],
        latitude: report.geometry.coordinates[1]
      }, nearbyEntities.permits);
      createdReport = await reportModel.create(Object.assign({}, report, {
        properties: {
          ...report.properties,
          confidence
        }
      }))
      createdCrane = await craneModel.create({
        geometry: {
          type: 'Point',
          coordinates: [nearestPermit.longitude, nearestPermit.latitude]
        },
        properties: {
          user_id: report.properties.user_id,
          permit: nearestPermit.master_use_permit,
          expiration_date: nearestPermit.expiration_date,
          address: nearestPermit.address,
          confidence: confidence
        }
      })
      return {
        message: 'Crane and report created.',
        result: {
          report: createdReport,
          crane: createdCrane
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
        result: {
          crane: createdCrane,
          report: null
        }
      }
  }
}

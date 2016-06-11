import defaults from 'lodash/defaults';
import craneModel from '../../resources/cranes/model';
import reportModel from '../../resources/reports/model';
import permitModel from '../../resources/permits/model';
import geolib from 'geolib';
const RADIUS_TO_SEARCH_IN_METERS = 500;

/**
 * Retrieves and filters cranes to within a given radius of report.
 * @param  {GeoJSON} Report - User report with geometry and properties.
 * @param  {Objec} Opt - Options object.
 * @param  {Number} Opt.radius - search radius in meters.
 * @return {Array} A promise that returns an array
 *  of nearby cranes as GeoJSON features.
 */
export async function cranes(report, opt) {
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
export function permits(report, opt) {
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
export async function reports(report, opt) {
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

function filterUniqueId(id, reports) {
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

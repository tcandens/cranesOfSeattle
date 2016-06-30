import Promise from 'bluebird';
import defaults from 'lodash/defaults';
import craneModel from '../../resources/cranes/model';
import reportModel from '../../resources/reports/model';
import permitModel from '../../resources/permits/model';
import geolib from 'geolib';

const defaultOptions = {
  radius: 60
}

/**
 * Retrieves and filters cranes to within a given radius of report.
 * @param  {GeoJSON} Report - User report with geometry and properties.
 * @param  {Objec} Opt - Options object.
 * @param  {Number} Opt.radius - search radius in meters.
 * @return {Array} A promise that returns an array
 *  of nearby cranes as GeoJSON features.
 */
export async function cranes(report, options = defaultOptions) {
  const [lng, lat] = report.geometry.coordinates;
  const cranesCollection = await craneModel.findWithin({
    lng,
    lat,
    radius: options.radius
  })
  return cranesCollection.features || [];
}

/**
 * Retrieves and filters permits to within a given radius of report.
 * @param  {geoJSON} User report with geometry and properties.
 * @param  {Object} Opt - Options object.
 * @param  {Number} Opt.radius - search radius in meters.
 * @return {<Array>} A promise the returns an array of permit objects.
 */
export async function permits(report, options = defaultOptions) {
  const permitCollection = await permitModel.fetchAll()
    .then(permits => {
      return permits.filter(permit => {
        const {longitude, latitude} = permit;
        const [reportLng, reportLat] = report.geometry.coordinates;
        return geolib.isPointInCircle(
          {latitude: latitude, longitude: longitude},
          {latitude: reportLat, longitude: reportLng},
          options.radius
        );
      });
    })
  return permitCollection;
}

/**
 * Retrieve and filters reports against radius and user_id
 * @param  {GeoJSON} User report with geometry and properties['user_id'].
 * @param  {Object} Opt - Options object.
 * @param  {Number} Opt.radius - Search radius in meters.
 * @return {<Array>} - A promise that returns an array of nearby
 * reports as GeoJSON features.
 */
export async function reports(report, options = defaultOptions) {
  const [lng, lat] = report.geometry.coordinates;
  const reportsCollection = await reportModel.findWithin({
    lng,
    lat,
    radius: options.radius
  })
  return reportsCollection;
}

export function findUserReports(report, nearby) {
  if (nearby.length === 0) {
    return [];
  }
  const userReports = nearby.filter(item => {
    if (!item.properties || !item.properties['user_id']) {
      return false;
    }
    return item.properties['user_id'] === report.properties['user_id'];
  });
  return userReports;
}

export function filterUniqueById(id, reports) {
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

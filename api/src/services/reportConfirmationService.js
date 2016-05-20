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
      const reportLng = report.geometry.coordinates[0];
      const reportLat = report.geometry.coordinates[1];
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

export function calculateReportConfidence(report, reports, permits) {
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
  const reportWithConfidence = Object.assign({}, report, {
    properties: Object.assign({}, report.properties, {
      confidence
    })
  });
  console.log(reportWithConfidence)
  return reportModel.create(reportWithConfidence).then(id => {
    const reportWithId = Object.assign({}, reportWithConfidence, {
      properties: Object.assign({}, reportWithConfidence.properties, {
        id
      })
    })
    console.log(reportWithId)
    return reportWithId;
  })
}

export default Promise.coroutine(function* confirmOrDenyReport(report) {
  const nearbyPermits = yield getNearbyPermits(report);
  const nearbyReports = yield getNearbyReports(report);
  const confidence = calculateReportConfidence(
    report,
    nearbyReports,
    nearbyPermits
  );
  return Promise.resolve(confidence);
});

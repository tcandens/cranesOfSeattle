import geolib from 'geolib';
import reportModel from '../../resources/reports/model';
import craneModel from '../../resources/cranes/model';

function findNearestToReport(report, nearby) {
  return geolib.findNearest({
    longitude: report.geometry.coordinates[0],
    latitude: report.geometry.coordinates[1]
  }, nearby);
}

function flattenGeoJSON(items) {
  return items.map(item => ({
    longitude: item.geometry.coordinates[0],
    latitude: item.geometry.coordinates[1],
    geometry: item.geometry,
    properties: item.properties
  }));
}

export function createReportWithConfidence(confidence, report) {
  return reportModel.create(Object.assign({}, report, {
    properties: {
      ...report.properties,
      confidence
    }
  }));
}

export async function respondWithReport(confidence, report) {
  const createdReport = await createReportWithConfidence(confidence, report);
  return {
    message: `Report created with confidence of ${confidence}.`,
    result: {
      report: createdReport,
      crane: undefined
    }
  };
}

export async function respondWithReportAndCrane(confidence, report, nearby) {
  const nearestPermit = findNearestToReport(report, nearby.permits);
  const createdReport = await createReportWithConfidence(confidence, report);
  const createdCrane = await craneModel.create({
    geometry: {
      type: 'Point',
      coordinates: [nearestPermit.longitude, nearestPermit.latitude]
    },
    properties: {
      user_id: report.properties.user_id,
      permit: nearestPermit.application_permit_number,
      expiration_date: nearestPermit.expiration_date,
      address: nearestPermit.address,
      confidence: confidence
    }
  });
  return {
    message: 'Crane and report created.',
    result: {
      report: createdReport,
      crane: createdCrane
    }
  };
}

export async function respondWithUpdatingCrane(confidence, report, nearby) {
  const flattened = flattenGeoJSON(nearby.permits);
  const nearestCrane = findNearestToReport(report, flattened);
  const createdCrane = await craneModel.update({
    id: nearestCrane.properties.id,
    confidence: nearestCrane.properties.confidence + report.properties.confidence
  });
  return {
    message: 'Updated confidence of nearest crane.',
    result: {
      crane: createdCrane,
      report: undefined
    }
  };
}

const responseMethodsByConfidence = {
  0: respondWithReport,
  1: respondWithReport,
  2: respondWithReport,
  3: respondWithReportAndCrane,
  4: respondWithUpdatingCrane
};

export default async function respondToConfidence(confidence, report, nearbyEntities) {
  if ((typeof responseMethodsByConfidence[confidence]) !== 'function') {
    throw new Error('Response method for confidence is not found.');
  }
  const response = await responseMethodsByConfidence[confidence](confidence, report, nearbyEntities);
  return response;
}

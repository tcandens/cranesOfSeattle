import geolib from 'geolib';
import reportModel from '../../resources/reports/model';
import craneModel from '../../resources/cranes/model';
import userModel from '../../resources/users/model';

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

const mapConfidenceToPoints = {
  0: 1,
  1: 10,
  2: 10,
  3: 60,
  4: 10
}

export async function addUserPoints(userId, confidence) {
  if (!mapConfidenceToPoints[confidence]) {
    throw new Error('No score found for confidence level.');
  }
  const added = mapConfidenceToPoints[confidence];
  const total = await userModel.addPoints(userId, mapConfidenceToPoints[confidence]);
  return {
    total,
    added
  };
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
  const userId = report.properties.user_id;
  const createdReport = await createReportWithConfidence(confidence, report);
  const userPoints = await addUserPoints(userId, confidence);
  return {
    message: `
      Thanks for contributing!
      A report was added and you have gained ${userPoints.added}
      ${userPoints.added > 1 ? 'points' : 'point'}!
    `,
    result: {
      report: createdReport,
      crane: undefined,
      user: userPoints
    }
  };
}

export async function respondWithReportAndCrane(confidence, report, nearby) {
  const userId = report.properties.user_id;
  const nearestPermit = findNearestToReport(report, nearby.permits);
  const createdReport = await createReportWithConfidence(confidence, report);
  const userPoints = await addUserPoints(userId, confidence);
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
    message: `
      Congratulations!
      You have discovered a new crane gaining ${userPoints.added} points!
    `,
    result: {
      report: createdReport,
      crane: createdCrane,
      user: userPoints
    }
  };
}

export async function respondWithUpdatingCrane(confidence, report, nearby) {
  const userId = report.properties.user_id;
  const flattened = flattenGeoJSON(nearby.permits);
  const nearestCrane = findNearestToReport(report, flattened);
  const createdCrane = await craneModel.update({
    id: nearestCrane.properties.id,
    confidence: nearestCrane.properties.confidence + report.properties.confidence
  });
  const userPoints = addUserPoints(userId, confidence);
  return {
    message: `
      Thank you!
      Your report has increased the confidence level of a nearby crane.
    `,
    result: {
      crane: createdCrane,
      report: undefined,
      user: userPoints
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

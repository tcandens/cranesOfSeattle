/**
 * Calculate the appropriate level of confidence for submitted report
 * as determined by nearby reports, permits, and cranes.
 * @param  {Object} User report GeoJSON object.
 * @param  {Array} Reports - Collection of nearby reports.
 * @param  {Array} Permits - Collection of nearby permits.
 * @param  {Array} Cranes - Collection of nearby cranes.
 * @return {Number|Integer} The confidence index of report: range {0...4}
 */
export default function calculateConfidence(report, reports, permits, cranes) {
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

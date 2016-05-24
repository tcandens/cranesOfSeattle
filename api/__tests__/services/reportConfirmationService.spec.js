import test from 'ava';
import {
  calculateConfidence,
} from '../../src/services/reportConfirmationService';

const report = {
  longitude: -122.3868,
  latitude: 47.6825
};

test('#calculateConfidence', t => {
  const reports = [
    {id: 2}, {id: 1}
  ];
  const permits = [
    {id: 2}, {id: 1}
  ];
  const confidence = calculateConfidence(report, reports, permits);
  t.is(confidence, 4, 'Confidence should return "4"');
});

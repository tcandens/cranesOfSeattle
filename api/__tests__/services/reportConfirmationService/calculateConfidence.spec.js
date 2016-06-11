import test from 'ava';
import calculateConfidence from '../../../src/services/reportConfirmation/calculateConfidence';

function report(options) {
  return Object.assign({}, options, {
    longitude: -122.3868,
    latitude: 47.6825
  });
}

/**
 * Mock arrays factory
 */
function a(length) {
  const a = [];
  a.length = length;
  return a;
}

test('#calculateConfidence', t => {
  t.is(
    calculateConfidence(report(), a(0), a(0), a(2)),
    4,
    'is 4 if there is a confirmed crane nearby.'
  );
  t.is(
    calculateConfidence(report(), a(2), a(2), a(0)),
    3,
    'is 3 if nearby reports and permits > 1'
  );
  t.is(
    calculateConfidence(report(), a(2), a(0), a(0)),
    2,
    'is 2 if nearby reports > 0 && permits == 0'
  );
  t.is(
    calculateConfidence(report(), a(0), a(2), a(0)),
    1,
    'is 3 if nearby permits > 0 && reports == 0'
  );
  t.is(
    calculateConfidence(report(), a(0), a(0), a(0)),
    0,
    'is 0 with no nearby permits or reports'
  );
});

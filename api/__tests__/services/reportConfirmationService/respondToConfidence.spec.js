import test from 'ava';
import {stub} from 'sinon';
import {
  respondToConfidence
} from '../../../src/services/reportConfirmationService';
import reportModel from '../../../src/resources/reports/model';
import craneModel from '../../../src/resources/cranes/model';

function report(options) {
  return Object.assign({}, options, {
    geometry: {
      longitude: -122.3868,
      latitude: 47.6825
    },
    properties: {
      user: 1337
    }
  });
}

/**
 * Set up test doubles and objects for #respondToConfidence
 */
const reportsFakeObject = {
  type: 'Feature',
  properties: {
    id: 99999
  },
  geometry: {
    type: 'Point',
    geometry: [report().longitude, report().latitude]
  }
}
const cranesFakeObject = {
  type: 'Feature',
  properties: {
    id: 88888
  },
  geometry: {
    type: 'Point',
    geometry: [report().longitude, report().latitude]
  }
}

let doubles = {};

test.before('Setup test doubles', () => {
  doubles = {
    report: {
      create: stub(reportModel, 'create').returns(reportsFakeObject)
    },
    crane: {
      create: stub(craneModel, 'create').returns(cranesFakeObject),
      update: stub(craneModel, 'update').returns(cranesFakeObject)
    }
  }
});

function resetDoubles() {
  doubles.report.create.reset();
  doubles.crane.create.reset();
  doubles.crane.update.reset();
}

test.beforeEach(() => {
  resetDoubles();
})

import isArray from 'lodash/isArray';
function withConfidenceOf(confidence, entities = {}) {
  const testEntities = ['permits', 'cranes', 'reports'].reduce((prev, val) => {
    if (entities[val] && isArray(entities[val])) {
      prev[val] = entities[val];
    } else {
      prev[val] = new Array(entities[val] || 0);
    }
    return prev;
  }, {})
  const response = respondToConfidence(confidence, report(), testEntities);
  return {
    t: undefined,
    capture(context) {
      this.t = context;
      return this;
    },
    expectCreated({crane, report}) {
      this.t.is(
        doubles.report.create.callCount,
        report
      );
      this.t.is(
        doubles.crane.create.callCount,
        crane
      );
      return this;
    },
    expectUpdated({crane}) {
      this.t.is(
        doubles.crane.update.callCount,
        crane
      );
      return this;
    },
    expectResult(expectedResult) {
      this.t.deepEqual(
        response.result,
        expectedResult
      );
      return this;
    },
    expectMessage(expectedMessage) {
      this.t.is(
        response.message,
        expectedMessage
      );
      return this;
    }
  }
}

test.serial('#respondToConfidence when 0', async t => {
  withConfidenceOf(0)
    .capture(t)
    .expectCreated({crane: 0, report: 1})
    .expectResult(reportsFakeObject)
    .expectMessage('Report created with confidence of 0.')
});

test.serial('#respondToConfidence when 1', async t => {
  withConfidenceOf(1)
    .capture(t)
    .expectCreated({crane: 0, report: 1})
    .expectResult(reportsFakeObject)
    .expectMessage('Report created with confidence of 1.');
});

test.serial('#respondToConfidence when 2', async t => {
  withConfidenceOf(2)
    .capture(t)
    .expectCreated({crane: 0, report: 1})
    .expectResult(reportsFakeObject)
    .expectMessage('Report created with confidence of 2.');
});

test.serial('#respondToConfidence when 3', async t => {
  withConfidenceOf(3, {
    permits: [{
      longitude: 44,
      latitude: 43
    }]
  })
    .capture(t)
    .expectCreated({crane: 1, report: 1})
    .expectResult({
      crane: cranesFakeObject,
      report: reportsFakeObject
    })
    .expectMessage('Crane and report created.');
});

test.serial('#respondToConfidence when 4', async t => {
  withConfidenceOf(4, {
    cranes: [{
      geometry: {
        latitude: 44,
        longitude: 42
      },
      properties: {
        id: 999
      }
    }]
  })
    .capture(t)
    .expectCreated({crane: 0, report: 0})
    .expectUpdated({crane: 1})
    .expectMessage('Updated confidence of nearest crane.')
})

import test from 'ava';
import {stub} from 'sinon';
import respondToConfidence from '../../../src/services/reportConfirmation/respondToConfidence';
import reportModel from '../../../src/resources/reports/model';
import craneModel from '../../../src/resources/cranes/model';

function report(options) {
  return Object.assign({}, options, {
    geometry: {
      coordinates: [-122.3868, 47.6826]
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
    geometry: {
      coordinates: [-122, 47]
    }
  }
}
const cranesFakeObject = {
  type: 'Feature',
  properties: {
    id: 88888
  },
  geometry: {
    type: 'Point',
    geometry: {
      coordinates: [-22, 46]
    }
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
async function withConfidenceOf(confidence, entities = {}) {
  const testEntities = ['permits', 'cranes', 'reports'].reduce((prev, val) => {
    if (entities[val] && isArray(entities[val])) {
      prev[val] = entities[val];
    } else {
      prev[val] = new Array(entities[val] || 0);
    }
    return prev;
  }, {})
  let response;
  try {
    response = await respondToConfidence(confidence, report(), testEntities);
  } catch(error) {
    response = error;
    console.error(error.toString())
  }
  return Promise.resolve({
    t: undefined,
    capture: function (context) {
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
  });
}

test.serial('#respondToConfidence when 0', async t => {
  await withConfidenceOf(0).then(context => {
    context.capture(t)
      .expectCreated({crane: 0, report: 1})
      .expectResult({
        report: reportsFakeObject,
        crane: null
      })
      .expectMessage('Report created with confidence of 0.')
  });
});

test.serial('#respondToConfidence when 1', async t => {
  await withConfidenceOf(1).then(context => {
    context.capture(t)
      .expectCreated({crane: 0, report: 1})
      .expectResult({
        report: reportsFakeObject,
        crane: null
      })
      .expectMessage('Report created with confidence of 1.');
  });
});

test.serial('#respondToConfidence when 2', async t => {
  await withConfidenceOf(2).then(context => {
    context.capture(t)
      .expectCreated({crane: 0, report: 1})
      .expectResult({
        report: reportsFakeObject,
        crane: null
      })
      .expectMessage('Report created with confidence of 2.');
  });
});

test.serial('#respondToConfidence when 3', async t => {
  await withConfidenceOf(3, {
    permits: [{
      longitude: 44,
      latitude: 43
    }]
  }).then(context => {
    context.capture(t)
      .expectCreated({crane: 1, report: 1})
      .expectResult({
        report: reportsFakeObject,
        crane: cranesFakeObject
      })
      .expectMessage('Crane and report created.');
  })
});

test.serial('#respondToConfidence when 4', async t => {
  await withConfidenceOf(4, {
    cranes: [{
      geometry: {
        coordinates: [42, 42]
      },
      properties: {
        id: 999
      }
    }]
  }).then(context => {
    context.capture(t)
      .expectCreated({crane: 0, report: 0})
      .expectUpdated({crane: 1})
      .expectMessage('Updated confidence of nearest crane.')
  })
})

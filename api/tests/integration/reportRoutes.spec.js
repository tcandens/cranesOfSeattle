/**
 * Dependencies
 */
require('leaked-handles').set({
  fullStack: true
});
import test from 'tape-dispenser'
import supertest from 'co-supertest'
import server from '../../src/server'
import database from '../../src/connections/db'

const request = supertest.agent(server);

const db = database.init();

function clearTables () {
  db.instance.query('TRUNCATE reports');
}

/**
 * Example of report model, adhering to geoJSON
 */
const testReport = {
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [-122.386444, 47.682961]
  },
  properties: {
    user_id: 1
  }
}

test('INSERTING A REPORT', function *(assert) {
  clearTables();
  const response = yield request
    .post('/reports')
    .send(testReport)
    .expect('Content-Type', /json/)
    .expect(201)
    .end();

  assert.ok(
    response.body.data.id,
    'Should respond with ID of inserted report.'
  );

  // Stash ID on testReport to test later
  testReport.properties.id = response.body.data.id;

});

test.skip('FETCHING REPORTS WITHIN RANGE', function *(assert) {
  // Insert another report that should be outside search radius
  request
    .post('/reports')
    .send(Object.create(testReport, {
      geometry: {
        type: 'Point',
        coordinates: [22, 44]
      }
    }))
    .end();

  const response = yield request
    .get('/reports')
    .query({lat: 47.682})
    .query({lng: -122.386})
    .expect('Content-Type', /json/)
    .expect(200)
    .end();

  const data = response.body.data;

  assert.equal(
    data.featureCollection.features.length,
    1,
    'Should return only the report within search radius.'
  );

  assert.equal(
    data.featureCollection.features[0].properties.id,
    testReport.properties.id,
    'ID of returned report should match our testReport'
  );

});

test('FETCHING ALL REPORTS', function *(assert) {
  const response = yield request
    .get('/reports')
    .expect('Content-Type', /json/)
    .expect(200)
    .end();

    const data = response.body.data;

    assert.equal(
      data.type,
      'FeatureCollection',
      'Should return geoJSON featureCollections'
    );

    assert.ok(
      (data.features instanceof Array),
      'Should return features as an array.'
    );

});

test('FETCHING A REPORT BY ID', function *(assert) {
  const response = yield request
    .get('/reports/' + testReport.properties.id)
    .expect('Content-Type', /json/)
    .expect(200)
    .end();

  assert.deepEqual(
    testReport,
    response.body.data,
    'Should return a report object that matches test report.'
  );

});

test('UPDATING A REPORT', function *(assert) {
  const updatedReport = {
    key: 'user_id',
    value: 9999,
    id: testReport.properties.id
  };

  const response = yield request
    .put('/reports/' + testReport.properties.id)
    .send(updatedReport)
    .expect(200)
    .end();

  assert.equal(
    response.body.message,
    'Report updated.',
    'Should return a message with status.'
  );

  const doubleCheck = yield request
    .get('/reports/' + testReport.properties.id)
    .end();

  assert.equal(
    doubleCheck.body.data.properties.user_id,
    updatedReport.value,
    'Should now return with updated row.'
  );

});

test('DESTROYING A REPORT', function *(assert) {
  const response = yield request
    .del('/reports/' + testReport.properties.id)
    .expect(200)
    .end();

  assert.equal(
    response.body.message,
    'Report destroyed.',
    'Should return a message with status.'
  );

});

server.close();

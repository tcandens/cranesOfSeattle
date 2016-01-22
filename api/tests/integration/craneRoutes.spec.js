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
  db.instance.query('TRUNCATE cranes');
}

/**
 * Example of crane model, adhering to geoJSON
 */
const testCrane = {
  type: 'Feature',
  geometry: {
    type: 'POINT',
    coordinates: [47.682961, -122.386444]
  },
  properties: {
    permit: '1337',
    address: '7349 Jones Ave NW',
    expiration: '01/01/70',
    user: '0001'
  }
}

test('INSERTING A CRANE', function *(assert) {
  clearTables();

  const response = yield request
    .post('/cranes')
    .send(testCrane)
    .expect(201)
    .expect('Content-Type', /json/)
    .end();

  assert.ok(
    response.body.data.id,
    'Should return the ID of new crane.'
  );

  // Stash returned ID to test later
  testCrane.properties.id = response.body.data.id;

});

test('FETCH CRANES WITHIN RANGE', function *(assert) {
  // Insert dummy crane outside of range
  const response = yield request
    .get('/cranes')
    .query({lat: 47.68})
    .query({lng: -122.38})
    .exect(200)
    .expect('Content-Type', /json/)
    .end();

  const data = response.body.data;

  assert.equal(
    data.featureCollection.features.length,
    1,
    'Should return only the cranes within search radius.'
  );

  assert.equal(
    data.featureCollection.features[0].properties.id,
    testCrane.properties.id,
    'ID of returned report should match our testCrane'
  );

});

test('FETCHING ALL CRANES', function *(assert) {
  const response = yield request
    .get('/cranes')
    .expect(200)
    .expect('Content-Type', /json/)
    .end()

    const data = response.body.data;

    assert.ok(
      (data.featureCollection.features instanceof Array),
      'Should return data as an array.'
    );

    assert.ok(
      (data.featureCollection.features.length >= 2),
      'Should have a length >=2.'
    );

});

test.skip('FETCHING A CRANE BY ID', function *(assert) {
  const response = yield request
    .get('/cranes/' + testCrane.properties.id)
    .expect(200)
    .expect('Content-Type', /json/)
    .end();

  assert.deepEqual(
    response.body.data,
    testCrane,
    'Should return a crane that matches test crane.'
  );

});

test.skip('UPDATING A CRANE', function *(assert) {
  const updatedCrane = {};

  const response = yield request
    .put('/cranes/' + testCrane.properties.id)
    .send(updatedCrane)
    .expect(200)
    .end();

  assert.equal(
    response.body.message,
    'Crane updated.',
    'Should return a message with status.'
  );

});

test.skip('DESTROYING A CRANE', function *(assert) {
  const response = yield request
    .del('/cranes/' + testCrane.properties.id)
    .expect(200)
    .end();

  assert.equal(
    response.body.message,
    'Crane destroyed.',
    'Should return a message with a status.'
  );

});

server.close();

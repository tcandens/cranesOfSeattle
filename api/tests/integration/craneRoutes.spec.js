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

async function clearTables () {
  await db.instance.none('DELETE FROM cranes');
}

/**
 * Example of crane model, adhering to geoJSON
 */
const testCrane = {
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [-122.386444, 47.682961]
  },
  properties: {
    permit: 1337,
    address: '7349 Jones Ave NW',
    expiration_date: '1970-01-01',
    user_id: 1
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

test('FETCHING A CRANE BY ID', function *(assert) {
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

test.skip('FETCH CRANES WITHIN RANGE', function *(assert) {
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

    assert.equal(
      data.type,
      'FeatureCollection',
      'Should return geoJSON featureCollections'
    );

    assert.ok(
      (data.features instanceof Array),
      'Should return data as an array.'
    );

    assert.equal(
      data.properties.name,
      'cranes',
      'Should return property name with value "cranes"'
    );

});

test.skip('UPDATING A CRANE', function *(assert) {
  const updatedCrane = {
    key: 'permit',
    value: 2323,
    id: testCrane.properties.id
  };

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

  const doubleCheck = yield request
    .get('/cranes/' + testCrane.properties.id)
    .end();

  assert.equal(
    doubleCheck.body.data.properties.permit,
    updatedCrane.value,
    'Should now return with updated row.'
  );

});

test('DESTROYING A CRANE', function *(assert) {
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

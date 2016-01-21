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
 * Setup
 * 1. Database must be cleared.
 */
function before() {
  clearTables();
}

/**
 * Teardown
 */
function after() {

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
  before();
  const response = yield request
    .post('/cranes')
    .send(testCrane)
    .expect(200)
    .expect('Content-Type', /json/)
    .end();

  assert.equal(
    (typeof response.body.data.id),
    'string',
    'Should return the ID of new crane'
  );
});

test.skip('FETCH CRANES WITHIN RANGE', function *(assert) {
  before();
  const response = yield request
    .get('/cranes')
    .query({lat: 47.68})
    .query({lng: -122.38})
    .exect(200)
    .expect('Content-Type', /json/)
    .end();

  assert.fail('No cranes nearby.')
});

test('FETCHING ALL CRANES', function *(assert) {
  const response = yield request
    .get('/cranes')
    .expect(200)
    .expect('Content-Type', /json/)
    .end()

  assert.ok((response.body.data instanceof Object), 'Response is an array.');
});

server.close();

import test from 'ava';
import request from 'supertest-as-promised';
import nock from 'nock';
import app from '../../src/app';
import database from '../../src/connections/postgres';
import jwt from 'jsonwebtoken';
import {TOKEN_SECRET} from '../../src/middleware/jwt_auth';

const db = database.init();
const server = app.listen();

function clearTables () {
  db.instance.none('TRUNCATE cranes');
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

test.serial('INSERTING A CRANE', async t => {

  clearTables();

  const res = await request(server)
    .post('/cranes')
    .send(testCrane)

  t.is(
    res.status,
    201,
    'Should return status 201 for created resource.'
  )
  t.regex(
    res.header['content-type'],
    /json/
  )
  t.is(
    (typeof res.body.id),
    'number',
    'Should return the ID of new crane.'
  );

  // Stash returned ID to test later
  testCrane.properties.id = res.body.id;

});

test.serial('FETCHING A CRANE BY ID', async t => {
  const res = await request(server)
    .get('/cranes/' + testCrane.properties.id)

  t.deepEqual(
    res.body,
    testCrane,
    'Should return a crane that matches test crane.'
  );

});

test.serial('FETCH CRANES WITHIN RANGE', async t => {
  // Insert dummy crane outside of range
  const res = await request(server)
    .get('/cranes')
    .query({
      lat: 47.68,
      lng: -122.38
    })

  t.is(
    res.status,
    200
  )
  t.is(
    res.body.features.length,
    1,
    'Should return only the cranes within search radius.'
  );

  t.is(
    res.body.features[0].properties.id,
    testCrane.properties.id,
    'ID of returned report should match our testCrane'
  );

});

test.serial('FETCHING ALL CRANES', async t => {
  const res = await request(server)
    .get('/cranes')

    t.is(
      res.status,
      200
    )
    t.regex(
      res.header['content-type'],
      /json/
    )
    t.is(
      res.body.type,
      'FeatureCollection',
      'Should return geoJSON featureCollections'
    );
    t.true(
      (res.body.features instanceof Array),
      'Should return data as an array.'
    );
    t.is(
      res.body.properties.name,
      'cranes',
      'Should return property name with value "cranes"'
    );

});

test.serial('UPDATING A CRANE', async t => {
  const updatedCrane = {
    key: 'permit',
    value: 2323,
    id: testCrane.properties.id
  };
  const postedNearby = await request(server)
    .put('/cranes/' + testCrane.properties.id)
    .send(updatedCrane)

  const doubleCheck = await request(server)
    .get('/cranes/' + testCrane.properties.id)

  t.is(
    postedNearby.status,
    204
  )
  t.is(
    doubleCheck.body.properties.permit,
    updatedCrane.value,
    'Should now return with updated row.'
  );

});

test.serial('DESTROYING A CRANE', async t => {
  const res = await request(server)
    .del('/cranes/' + testCrane.properties.id)

  t.is(
    res.status,
    204,
    'Should return code 204 for destroyed resource.'
  )

});

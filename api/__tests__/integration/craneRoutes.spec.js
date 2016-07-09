import test from 'ava';
import request from 'supertest-as-promised';
import app from '../../src/app';
import database from '../../src/connections/postgres';
import jwt from 'jsonwebtoken';
import {TOKEN_SECRET} from '../../src/middleware/jwt_auth';
import craneModel from '../../src/resources/cranes/model';
import destination from 'turf-destination';

const db = database.init();
const server = app.listen();

function clearTables () {
  return db.instance.none('TRUNCATE cranes');
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
    permit: '1337',
    confidence: 3,
    address: '7349 Jones Ave NW',
    expiration_date: '1970-01-01',
    user_id: 1
  }
}

test.after('Cleanup database', async t => {
  await clearTables();
});

test.serial('FETCHING A CRANE BY ID', async t => {
  // Insert crane into database
  const crane = await craneModel.create(testCrane);

  const res = await request(server)
    .get('/cranes/' + crane.properties.id)

  t.is(
    res.body.properties.id,
    crane.properties.id
  );
  t.truthy(res.body.geometry);

  testCrane.properties.id = crane.properties.id;
});

test.skip.serial('FETCH CRANES WITHIN RANGE', async t => {
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
  const token = jwt.sign({}, TOKEN_SECRET);

  const updatedCrane = {
    key: 'permit',
    value: 2323
  };
  const postedNearby = await request(server)
    .put('/cranes/' + testCrane.properties.id)
    .set({'Authorization': `Bearer ${token}`})
    .send(updatedCrane)

  const doubleCheck = await craneModel.read(testCrane.properties.id);

  t.is(
    postedNearby.status,
    204
  )
  t.is(
    doubleCheck.properties.permit,
    updatedCrane.value,
    'Should now return with updated row.'
  );

});

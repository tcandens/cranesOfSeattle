import test from 'ava';
import request from 'supertest-as-promised';
import nock from 'nock';
import app from '../../src/app';
import database from '../../src/connections/postgres';
import jwt from 'jsonwebtoken';
import {TOKEN_SECRET} from '../../src/middleware/jwt_auth';
import {RADIUS} from '../../src/services/reportConfirmation/nearbyResources';
import {buildEndpoint} from '../../src/resources/permits/model';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import userModel from '../../src/resources/users/model';
import destination from 'turf-destination';

const db = database.init();
const server = app.listen();

function clearTables () {
  return db.instance.query('TRUNCATE reports');
}

/**
 * Example of report model, adhering to geoJSON
 */
const testReport = {
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [-122.386444444444, 47.6829614444444]
  },
  properties: {}
}

const testUser = {
  image_url: 'testUrl',
  points: 0,
  email: 'test@test.com',
  name: 'Dr. Testnik',
  auth_provider: 'test_provider',
  auth_provider_id: 12
}

const testPermits = [
  {
    "action_type": "ADD/ALT",
    "address": "3612 48TH AVE SW",
    "applicant_name": "WOLPA, ZACHARY",
    "application_permit_number": "6304884",
    "category": "SINGLE FAMILY / DUPLEX",
    "description": "Construct alterations to existing single family residence,",
    "latitude": "47.57163644",
    "location": {
      "type": "Point",
      "coordinates": [
        -122.393174,
        47.571636
      ]
    },
    "longitude": "-122.39317393",
    "permit_and_complaint_status_url": "http://web6.seattle.gov/dpd/PermitStatus/Project.aspx?id=6304884",
    "permit_type": "Construction",
    "status": "Initial Information Collected",
    "value": "0",
    "work_type": "No plan review"
  }
];

test.before('Add test user', async t => {
  const user = await userModel.create(testUser);
  testReport.properties.user_id = user.id;
  testUser.id = user.id;
})

function mockPermitApi() {
  const endpoint = buildEndpoint();
  nock(endpoint.hostname)
    .get(/resource/)
    .reply(200, testPermits);
}

test.beforeEach('Setup', t => {
  mockPermitApi();
  t.context.token = jwt.sign(testUser, TOKEN_SECRET);
});

test.after('Clean database', async t => {
  await clearTables();
});

test.serial('INSERT A REPORT WITH REPORT(S) FROM USER NEARBY', async t => {
  await clearTables();

  const firstReport = await request(server)
    .post('/reports')
    .set('Authorization', `Bearer ${t.context.token}`)
    .send(testReport)

  const testRadius = (RADIUS - 1) / 1000;
  const secondTestReport = destination(testReport, testRadius, 0);
  secondTestReport.properties.user_id = testReport.properties.user_id;

  mockPermitApi();

  const secondReport = await request(server)
    .post('/reports')
    .set('Authorization', `Bearer ${t.context.token}`)
    .send(secondTestReport)

  t.truthy(firstReport.body.result);
  t.falsy(secondReport.body.result);
});

test.serial('INSERTING A REPORT WITH NO REPORTS FROM USER NEARBY', async t => {

  await clearTables();

  const res = await request(server)
    .post('/reports')
    .set('Authorization', `Bearer ${t.context.token}`)
    .send(testReport)

  t.true(isString(res.body.message));

  t.true(isObject(res.body.result));

  t.true(isNumber(res.body.result.report.properties.id));

  t.true(isNumber(res.body.result.report.properties.confidence))

  // Stash ID on testReport to test later
  testReport.properties.id = res.body.result.report.properties.id;

});

test.serial('FETCHING REPORTS BY USER', async t => {

  const response = await request(server)
    .get('/reports')
    .query({user: testUser.id})

  console.log(response.body)
  t.is(response.status, 200);
  t.true(isArray(response.body))

});

test.skip.serial('FETCHING REPORTS WITHIN RANGE', async t => {
  const postedNearby = await request(server)
    .post('/reports')
    .set({
      authorization: `Bearer ${t.context.token}`
    })
    .send(Object.create(testReport, {
      geometry: {
        type: 'Point',
        coordinates: [22, 44]
      }
    }))

  const res = await request(server)
    .get('/reports')
    .query({
      lat: 47.682,
      lng: -122.386,
      radius: 100
    })

  const data = res.body;

  t.is(
    res.status,
    200
  );
  t.regex(
    res.headers['content-type'],
    /json/,
    'Should return JSON.'
  );
  t.is(
    data.features.length,
    1,
    'Should return only the report within search radius.'
  );

  t.is(
    data.features[0].properties.id,
    testReport.properties.id,
    'ID of returned report should match our testReport'
  );

});

test.serial('FETCHING ALL REPORTS', async t => {

  const response =  await request(server)
    .get('/reports')
  const data = response.body;

  t.is(
    response.status,
    200
  )
  t.is(
    data.type,
    'FeatureCollection',
    'Should return geoJSON featureCollections'
  );

  t.true(
    isArray(data.features),
    'Should return features as an array.'
  );

  t.is(
    data.properties.name,
    'reports',
    'Should have property of name "reports"'
  );

});

test.serial('FETCHING A REPORT BY ID', async t => {

  const res = await request(server)
    .get('/reports/' + testReport.properties.id)

  t.is(
    res.status,
    200
  );

  t.is(
    res.body.properties.id,
    testReport.properties.id,
  );

  t.deepEqual(
    res.body.properties.geometry,
    testReport.properties.geometry
  );

});

test.serial('UPDATING A REPORT', async t => {
  const updatedReport = {
    key: 'confidence',
    value: 9999,
  };

  const res = await request(server)
    .put('/reports/' + testReport.properties.id)
    .set({
      'Authorization': `Bearer ${t.context.token}`
    })
    .send(updatedReport)

  const doubleCheck = await request(server)
    .get('/reports/' + testReport.properties.id)

  t.is(
    res.status,
    204
  );
  t.is(
    doubleCheck.body.properties.confidence,
    updatedReport.value,
    'Should now return with updated row.'
  );
});

test.serial('DESTROYING A REPORT', async t => {
  const res = await request(server)
    .del('/reports/' + testReport.properties.id)
    .set({
      'Authorization': `Bearer ${t.context.token}`
    });

  t.is(
    res.status,
    204
  )

});

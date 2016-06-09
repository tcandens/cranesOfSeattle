import test from 'ava';
import request from 'supertest-as-promised';
import nock from 'nock';
import app from '../../src/app';
import database from '../../src/connections/postgres';
import jwt from 'jsonwebtoken';
import {TOKEN_SECRET} from '../../src/middleware/jwt_auth';
import {buildEndpoint} from '../../src/resources/permits/model';

const db = database.init();
const server = app.listen();

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

const testUser = {
  id: '0',
  name: 'Test User',
};

test.beforeEach('Setup', t => {
  const endpoint = buildEndpoint();
  nock(endpoint.hostname)
    .get(/resource/)
    .reply(200, testPermits);
  t.context.token = jwt.sign(testUser, TOKEN_SECRET);
});

// Were goint to need some test stubs here
// for reportConfirmationService
test.serial('INSERTING A REPORT', async t => {

  clearTables();

  const res = await request(server)
    .post('/reports')
    .set('Authorization', `Bearer ${t.context.token}`)
    .send(testReport)

  t.is(
    res.body.result.type,
    'Feature',
    'Should responsed with GeoJSON of new report'
  );
  t.is(
    (typeof res.body.properties.id),
    'number',
    'Should respond with ID of inserted report.'
  );
  t.is(
    (typeof res.body.properties.confidence),
    'number',
    'Should responde with confidence of inserted report.'
  )

  // Stash ID on testReport to test later
  testReport.properties.id = res.body.properties.id;

});

test.serial('FETCHING REPORTS WITHIN RANGE', async t => {
  // Insert another report that should be outside search radius
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
  )
  t.regex(
    res.headers['content-type'],
    /json/,
    'Should return JSON.'
  )
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
    (data.features instanceof Array),
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
  )
  t.deepEqual(
    testReport,
    res.body,
    'Should return a report object that matches test report.'
  );

});

test.serial('UPDATING A REPORT', async t => {
  const updatedReport = {
    key: 'user_id',
    value: 9999,
    id: testReport.properties.id
  };

  const res = await request(server)
    .put('/reports/' + testReport.properties.id)
    .set({
      'authorization': `Bearer ${t.context.token}`
    })
    .send(updatedReport)
    .expect(204)

  const doubleCheck = await request(server)
    .get('/reports/' + testReport.properties.id)

  t.is(
    res.status,
    204
  )
  t.is(
    doubleCheck.body.properties.user_id,
    updatedReport.value,
    'Should now return with updated row.'
  );

});

test.serial('DESTROYING A REPORT', async t => {
  const res = await request(server)
    .del('/reports/' + testReport.properties.id)
    .set({
      'authorization': `Bearer ${t.context.token}`
    });

  t.is(
    res.status,
    204
  )

});

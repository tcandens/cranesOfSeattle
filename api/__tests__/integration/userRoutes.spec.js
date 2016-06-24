import test from 'ava';
import request from 'supertest-as-promised';
import app from '../../src/app';
import database from '../../src/connections/postgres';

const db = database.init();
const server = app.listen();

function clearTables () {
  db.instance.query('TRUNCATE users');
}

/**
 * Example of user model
 */
const testUser = {
  name: 'Douglas Adams',
  auth_provider: 'fakeProvider',
  auth_provider_id: 1234,
  email: 'douglas.adams@test.com',
  image_url: 'https://test.user.com/image_url'
}

test.serial('INSERTING A USER', async t => {

  clearTables();

  const res = await request(server)
    .post('/users')
    .send(testUser)

  t.is(
    res.status,
    201,
    'Should return 201 for created resource.'
  )
  t.regex(
    res.headers['content-type'],
    /json/,
    'Should return JSON.'
  )
  t.is(
    (typeof res.body.id),
    'number',
    'Should return the ID of new user.'
  );

  // Stash returned ID to test later
  testUser.id = res.body.id;

});

test.serial('FETCHING A USER', async t => {
  const res = await request(server)
    .get('/users/' + testUser.id)

  t.regex(
    res.headers['content-type'],
    /json/
  )
  t.deepEqual(
    testUser,
    res.body,
    'Should return a user row that matches test user.'
  );

});

test.skip('UPDATING A USER', function *(assert) {
  const updatedUser = {};

  const response = yield request
    .put('/users/' + testUser.id)
    .send(updatedUser)
    .end();

  assert.equal(
    response.body.message,
    'User updated.',
    'Should return a message with status.'
  );

});

test.skip('DESTROYING A USER', function *(assert) {
  const response = yield request
    .del('/user/' + testUser.id)
    .expect(200)
    .end();

  assert.equal(
    response.body.message,
    'User destroyed',
    'Should return a message with status.'
  );

});

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
  db.instance.query('TRUNCATE users');
}

/**
 * Example of user model
 */
const testUser = { }

test('INSERTING A USER', function *(assert) {
  clearTables();

  const response = yield request
    .post('/users')
    .send(testUser)
    .expect(201)
    .expect('Content-Type', /json/)
    .end();

  assert.ok(
    response.body.data.id,
    'Should return the ID of new user.'
  );

  // Stash returned ID to test later
  testUser.id = response.body.data.id;

});

test('FETCHING A USER', function *(assert) {
  const response = yield request
    .get('/users/' + testUser.id)
    .expect('Content-Type', /json/)
    .expect(200)
    .end();

  assert.deepEqual(
    testUser,
    response.body.data,
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

server.close();

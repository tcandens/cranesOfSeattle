import test from 'ava';
import request from 'supertest-as-promised';
import app from '../../src/app';
import database from '../../src/connections/postgres';
import jwt from 'jsonwebtoken';
import {TOKEN_SECRET} from '../../src/middleware/jwt_auth';
import userModel from '../../resources/users/model';

const db = database.init();
const server = app.listen();

function clearTables() {
  return db.instance.query('TRUNCATE users');
}

/**
 * Example of user model
 */
const testUser = {
  name: 'Douglas Adams',
  auth_provider: 'fakeProvider',
  auth_provider_id: 1234,
  email: 'douglas.adams@test.com',
  image_url: 'https://test.user.com/image_url',
  points: 0
}

test.beforeEach('Setup auth', t => {
  const token = jwt.sign({}, TOKEN_SECRET);
  t.context.headers = {
    'Authorization': `Bearer ${token}`
  }
});

test.after('Cleanup database', async t => {
  await clearTables();
})

test.skip.serial('INSERTING A USER', async t => {

  await clearTables();

  const res = await request(server)
    .post('/users')
    .set(t.context.headers)
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

});

test.serial('FETCHING A USER BY ID', async t => {
  const user = await userModel.create(testUser);

  const res = await request(server)
    .get('/users/' + test.id)
    .set(t.context.headers)

  t.is(
    res.body.id,
    testUser.id
  );

});

test.serial('UPDATING A USER', async t => {
  const updatedUser = {
    key: 'points',
    value: 2
  };

  const response = await request(server)
    .put('/users/' + testUser.id)
    .set(t.context.headers)
    .send(updatedUser)

  t.is(
    response.status,
    200
  );
  t.is(
    response.body.message,
    'User updated.',
    'Should return a message with status.'
  );

  const doubleCheckUser = Object.assign({}, testUser, {
    [updatedUser.key]: updatedUser.value
  })
  const doubleCheck = await request(server)
    .get('/users/' + testUser.id)
    .set(t.context.headers)

  t.is(
    doubleCheckUser.points,
    doubleCheck.body.points,
    'Should have update row.'
  );
});

test('DESTROYING A USER', async t => {
  const response = await request(server)
    .del('/users/' + testUser.id)
    .set(t.context.headers)

  t.is(
    response.status,
    204
  );
});

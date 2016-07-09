import test from 'ava';
import request from 'supertest-as-promised';
import app from '../../src/app';
import database from '../../src/connections/postgres';
import jwt from 'jsonwebtoken';
import {TOKEN_SECRET} from '../../src/middleware/jwt_auth';
import userModel from '../../src/resources/users/model';

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
  await clearTables();

  const user = await userModel.create(testUser);

  const res = await request(server)
    .get('/users/' + user.id)
    .set(t.context.headers)

  t.is(
    res.body.id,
    user.id
  );

});

test.serial('UPDATING A USER', async t => {
  await clearTables();

  const toUpdate = {
    key: 'points',
    value: 2
  };
  const user = await userModel.create(testUser);

  const response = await request(server)
    .put('/users/' + user.id)
    .set(t.context.headers)
    .send(toUpdate)

  t.is(
    response.status,
    200
  );

  const doubleCheckUser = Object.assign({}, testUser, {
    [toUpdate.key]: toUpdate.value
  })
  const doubleCheck = await userModel.read(user.id)

  t.is(
    doubleCheckUser.points,
    doubleCheck.points,
    'Should have update row.'
  );
});

import test from 'ava';
import request from 'supertest-as-promised';
import app from '../../src/app';
import faker from 'faker';
import database from '../../src/connections/postgres';
import jwt from 'jsonwebtoken';
import {TOKEN_SECRET} from '../../src/middleware/jwt_auth';
import userModel from '../../src/resources/users/model';
import reportModel from '../../src/resources/reports/model';
import isArray from 'lodash/isArray';

const db = database.init();
const server = app.listen();

function clearTables() {
  return db.instance.query('TRUNCATE users');
}

function buildFakeUser() {
  return {
    name: faker.name.firstName(),
    auth_provider: 'Google',
    auth_provider_id: faker.random.number(4),
    email: faker.internet.email(),
    image_url: faker.internet.avatar(),
    points: faker.random.number(200)
  }
}
async function seedFakeUsers(count) {
  for(let i = 0; i < count; i++) {
    await userModel.create(buildFakeUser());
  }
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

test.serial('FETCHING A USER BY ID', async t => {
  await clearTables();

  const testUser = buildFakeUser();
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
  const testUser = buildFakeUser();
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

test.serial('FETCH ALL USER PROFILES', async t => {
  await clearTables();
  await seedFakeUsers(20);

  const response = await request(server)
    .get('/users')

  t.is(
    response.status,
    200
  );

  t.is(
    response.body.length,
    20,
    'Reponse is an array of profiles'
  );

});
test.serial('FETCH ALL USER PROFILES SORTING BY POINTS', async t => {
  await clearTables();
  await seedFakeUsers(20);

  const response = await request(server)
    .get('/users')
    .query({ by: 'points' })

  t.is(response.status, 200);

  const failed = [];

  for (let i = 1; i < response.body.length; i++) {
    const current = response.body[i];
    const previous = response.body[i - 1];
    if (current.points > previous.points) {
      failed.push([current.points, previous.points])
    }
  }

  t.is(
    failed.length,
    0,
    'Response should be in descending order.'
  );

});
test.serial('FETCH ALL USER PROFILES WITH PAGINATION', async t => {
  await clearTables();
  await seedFakeUsers(50);

  const limit = 25;
  const offset = 20;

  const response = await request(server)
    .get('/users')
    .query({by: 'points'})
    .query({limit: limit})
    .query({offset: offset})

  const verifyingSet = await userModel.getLeaders(0, 50);

  t.is(
    response.body.length,
    limit,
    'Should return pagination limit of 20 rows'
  );

  t.is(
    verifyingSet[offset].id,
    response.body[0].id,
    'Offset item should be same as item of offset index in general set.'
  );
});

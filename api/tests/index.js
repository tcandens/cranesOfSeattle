/**
 * Environmental Variables
 */
// process.env.PGDATABASE = 'test'
/**
 * Dependencies
 */
import leaks from 'leaked-handles'
import test from 'tape-dispenser'
import supertest from 'co-supertest'
// import db from '../connections/db'
import { app } from '../src/app'

// See TODO: API->testing
// TODO: Run migrations on test database

const request = supertest.agent(server);

test('First test!', {timeout: 2000}, function *(assert) {
  const res = yield request
    .get('/cranes')
    .expect(200)
    .end()
  assert.ok(res, 'Response from /cranes');
  assert.timeoutAfter(2000);
});

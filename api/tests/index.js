/**
 * Environmental Variables
 */
// process.env.PGDATABASE = 'test'
/**
 * Dependencies
 */
// require('leaked-handles').set({
//   fullStack: true
// });
import test from 'tape-dispenser'
import supertest from 'co-supertest'
import { server } from '../src/server'

const request = supertest.agent(server);

test('First test!', function *(assert) {
  const res = yield request
    .get('/cranes')
    .expect(200)
    .end()
  assert.ok(res, 'Response from /cranes');
  assert.timeoutAfter(2000);
});

test('Second test', function (assert) {
  assert.pass('Hey there!');
});

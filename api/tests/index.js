/**
 * Environmental Variables
 */
// process.env.PGDATABASE = 'test'
/**
 * Dependencies
 */
require('leaked-handles').set({
  fullStack: true
});
import test from 'tape-dispenser'
import supertest from 'co-supertest'
import { server } from '../src/server'

const request = supertest.agent(server);

test('Checking GET->/cranes', function *(assert) {
  const res = yield request
    .get('/cranes')
    .expect(200)
    .end()
  assert.ok((res.body instanceof Array), 'Response from is an array.');
});

server.close();

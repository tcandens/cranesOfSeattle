/**
 * Environmental Variables
 */
process.env.PGDATABASE = 'test';
process.env.ENV = 'test'

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
/**
 * Setup
 * 1. Migrations must be run for test database
 */
function before() {

}

/**
 * Teardown
 * 1. Database must be cleared.
 */
function after() {

}

test('Checking GET->/cranes', function *(assert) {
  const res = yield request
    .get('/cranes')
    .expect(200)
    .end()
  assert.ok((res.body instanceof Array), 'Response from is an array.');
});

server.close();

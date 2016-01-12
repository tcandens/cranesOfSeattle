import test from 'tape-dispenser'
import { server } from '../src/server'
import supertest from 'co-supertest'

const request = supertest.agent(server);

test('First test!', function *(assert) {
  const res = yield request
    .get('/')
    .expect(200)
    .end()
  assert.equal(res.text, 'Hello there');
});

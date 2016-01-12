import test from 'tape-dispenser'
import { app } from '../src/app'
import supertest from 'co-supertest'

const request = supertest.agent(app.listen());

test('First test!', function *(assert) {
  const res = yield request
    .get('/')
    .expect(200)
    .end()
  assert.equal(res.text, 'Hello there');
});

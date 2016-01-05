const test = require('tape');
const request = require('supertest');
process.env.PORT = 3333;
const app = require('../src/server');


test('First test!', assert => {
  request(app)
    .get('/test')
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      assert.end();
    });
  console.log('Testing test setup.');
  assert.end();
});

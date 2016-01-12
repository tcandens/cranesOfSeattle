import test from 'tape'
import { server } from '../src/server'

const request = require('superagent').agent(server);

test('First test!', function(assert) {
  request
    .get('/cranes')
    .end((err, res) => {
      assert.ok(res);
      assert.end();
    });
});

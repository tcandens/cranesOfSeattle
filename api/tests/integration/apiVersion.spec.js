/**
 * Dependencies
 */
require('leaked-handles').set({
  fullStack: true
});
import test from 'tape-dispenser'
import supertest from 'co-supertest'
import server from '../../src/server'
import packageJSON from '../../package.json'

const request = supertest.agent(server);

const currentVersion = packageJSON.version;

test('CHECKING API VERSION IS IN RESPONSE HEADERS', function *(assert) {
  const response = request
    .get('/reports')
    .expect(200)
    .expect('API-Version', '2')
    .end();

  // assert.equal(
  //   response.header,
  //   currentVersion,
  //   'Should return header field with version matching current version.'
  // );

});

server.close();

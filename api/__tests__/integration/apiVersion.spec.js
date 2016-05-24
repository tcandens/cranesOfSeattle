import test from 'ava';
import request from 'supertest-as-promised';
import app from '../../src/app';
import packageJSON from '../../package.json';
const currentVersion = packageJSON.version;

test.beforeEach('Create test app', t => {
  t.context.app = app;
});

test('CHECKING API VERSION IS IN RESPONSE HEADERS', async function(t) {
  t.plan(2);

  const res = await request(t.context.app.listen())
    .get('/reports');

  t.is(res.status, 200, 'Should return a 200 status code.');
  t.is(
    res.headers['api-version'],
    currentVersion,
    'Should return header field with version matching current version.'
  );
});

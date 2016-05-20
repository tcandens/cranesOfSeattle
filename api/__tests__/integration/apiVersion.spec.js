import test from 'ava';
import request from 'supertest-as-promised';
import Koa from 'koa';
import apiVersion from '../../src/middleware/version';
import Router from 'koa-router';
import packageJSON from '../../package.json'

const currentVersion = packageJSON.version;

function buildApp() {
  const app = new Koa();
  app.use(apiVersion(currentVersion));
  app.use(Router().get('/', ctx => {
    ctx.status = 200;
  }).routes());
  return app;
}

test('API Version is in response headers', async t => {
  t.plan(2);

  const res = await request(buildApp())
    .get('/')

  t.is(res.status, 200);
  t.is(res.headers['api-version'], currentVersion);
});

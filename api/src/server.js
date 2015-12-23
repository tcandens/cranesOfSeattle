var PORT = process.env.PORT || 3000;
var koa = require('koa');
var router = require('koa-router')();
var logger = require('koa-logger');
var json = require('koa-json');

var app = koa();

app.use(json());
app.use(logger());

router.get('/', function *() {
  this.body = { message: 'Hello there!' };
});

router.get('/test', function *() {
  this.body = { message: 'Testing!' };
});

router.get('/names/last/:name', function *() {
  this.body = {
    user: {
      last: this.params.name
    }
  }
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(PORT);

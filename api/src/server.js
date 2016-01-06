import koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import json from 'koa-json';

let router = Router();

const PORT = process.env.PORT || 3000;

//db.one('insert into cranes(number, status) values($1, $2) returning id',
  //[1, 'active'])
  //.then(data => {
    //console.log(data)
  //})
  //.catch(error => {
    //console.log(error);
  //});

const app = koa();

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
  };
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(PORT);

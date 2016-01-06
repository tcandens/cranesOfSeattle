import koa from 'koa'
import Router from 'koa-router'
import logger from 'koa-logger'
import json from 'koa-json'
import parseJson from 'koa-parse-json'
import db from './connections/db'

let router = Router();

// Create table
//db.none('CREATE TABLE cranes (id serial, name varchar (12))')
  //.catch(error => {
    //console.log(error);
  //})

const PORT = process.env.PORT || 3000;

const app = koa();

app.use(parseJson());
app.use(json());
app.use(logger());

router.get('/', function *() {
  this.body = { message: 'Hello there!' };
});

router.get('/cranes', function *(next) {
  let cranes = yield db.any('SELECT name, id FROM cranes');
  this.body = cranes;
});

router.post('/cranes', function *(next) {
  let crane = this.request.body;
  let id = yield db.one('INSERT into cranes(name) values($1) returning id', [crane.name]);
  this.body = id;
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(PORT);

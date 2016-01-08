import Router from 'koa-router'
import db from '../connections/db'
import craneModel from '../models/crane'

console.log(craneModel);

export default Router()
  .get('/', function *() {
    this.body = { message: 'Hello there!' };
  })
  .get('/cranes', function *() {
    let cranes = yield db.any('SELECT name, id FROM cranes');
    this.body = cranes;
  })
  .post('/cranes', function *() {
    let crane = this.request.body;
    let id = yield db.one('INSERT into cranes(name) values($1) returning id', [crane.name]);
    this.body = id;
  })

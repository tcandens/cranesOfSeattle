import Router from 'koa-router'
import craneModel from '../models/crane'

export default Router()
  .get('/', function *() {
    this.body = { message: 'Hello there!' };
  })
  .get('/cranes', function *() {
    let cranes = yield craneModel.addCrane({latitude: '144', longitude: '22'});
    this.body = cranes;
  })
  .post('/cranes', function *() {
    let crane = this.request.body;
    let id = yield db.one('INSERT into cranes(name) values($1) returning id', [crane.name]);
    this.body = id;
  })

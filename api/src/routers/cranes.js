import Router from 'koa-router'
import craneModel from '../models/crane'

export default Router()
  .get('/', function *() {
    this.body = { message: 'Hello there!' };
  })
  .get('/cranes', function *() {
    let cranes = yield craneModel.fetchAll();
    this.body = cranes;
  })
  .post('/cranes', function *() {
    let crane = this.request.body;
    let id = yield craneModel.report(crane);
    this.body = id;
  })

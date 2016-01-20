import Router from 'koa-router'
import craneModel from '../models/crane'

export default Router()
  .get('/', (ctx) => {
    ctx.body = { message: 'Hello there!' };
  })
  .get('/cranes', async (ctx) => {
    let cranes = await craneModel.fetchAll();
    ctx.body = cranes;
  })
  .post('/cranes', async (ctx) => {
    let crane = ctx.request.body;
    let id = await craneModel.report(crane);
    ctx.body = id;
  })

import Router from 'koa-router'
import craneModel from '../models/crane'

export default Router()
  .get('/', (ctx) => {
    ctx.body = { message: 'Hello there!' };
  })
  .get('/cranes', async (ctx) => {
    let response = await craneModel.fetchAll();
    ctx.body = {
      data: response
    };
  })
  .post('/cranes', async (ctx) => {
    let crane = ctx.request.body;
    let response = await craneModel.report(crane);
    console.log(response)
    ctx.body = {
      data: response
    };
  })

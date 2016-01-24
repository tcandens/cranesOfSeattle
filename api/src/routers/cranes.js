import Router from 'koa-router'
import craneModel from '../models/crane'

export default Router()
  .get('/cranes', async (ctx) => {
    let response = await craneModel.readAll();
    ctx.status = 200;
    ctx.body = {
      data: response
    };
  })
  .get('/cranes/:id', async (ctx) => {
    let response = craneModel.read(ctx.params.id);
    await response
      .then(data => {
        ctx.status = 200;
        ctx.body = {
          data: data
        };
      })
      .catch(error => {
        ctx.status = 500;
        ctx.body = error.toString();
      });
  })
  .post('/cranes', async (ctx) => {
    let crane = ctx.request.body;
    let response = craneModel.create(crane);
    await response
      .then(data => {
        ctx.status = 201;
        ctx.body = {
          data: data
        };
      })
      .catch(error => {
        ctx.status = 500;
        ctx.body = error.toString();
      });
  })
  .del('/cranes/:id', async (ctx) => {
    const params = ctx.params;
  })

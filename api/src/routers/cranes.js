import Router from 'koa-router'
import craneModel from '../models/crane'

export default Router()
  .get('/cranes', async (ctx) => {
    await craneModel.readAll()
      .then(data => {
        ctx.status = 200;
        ctx.body = data;
      })
      .catch(error => {
        ctx.status = 500;
        ctx.body = error.toString();
      });
  })
  .get('/cranes/within', async (ctx) => {
    const response = craneModel.findWithin(ctx.query);
    await response
      .then(data => {
        ctx.body = data;
      })
      .catch(error => {
        ctx.status = 500;
        ctx.body = error.toString();
      });
  })
  .get('/cranes/:id', async (ctx) => {
    await craneModel.read(ctx.params.id)
      .then(data => {
        ctx.status = 200;
        ctx.body = data;
      })
      .catch(error => {
        ctx.status = 500;
        ctx.body = error.toString();
      });
  })
  .post('/cranes', async (ctx) => {
    await craneModel.create(ctx.request.body)
      .then(data => {
        ctx.status = 201;
        ctx.body = data;
      })
      .catch(error => {
        ctx.status = 500;
        ctx.body = error.toString();
      });
  })
  .put('/cranes/:id', async (ctx) => {
    let crane = ctx.request.body;
    crane.id = ctx.params.id;
    let response = craneModel.update(crane);
    await response
      .then(data => {
        ctx.body = data;
      })
      .catch(error => {
        ctx.status = 500;
        ctx.body = error.toString();
      });
  })
  .del('/cranes/:id', async (ctx) => {
    await craneModel.destroy(ctx.params.id)
      .then(data => {
        ctx.body = data;
      })
      .catch(error => {
        ctx.status = 500;
        ctx.body = error.toString();
      });
  })

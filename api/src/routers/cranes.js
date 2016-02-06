import Router from 'koa-router'
import craneModel from '../models/crane'

export default Router()
  .get('/cranes', async (ctx) => {
    let response = craneModel.readAll();
    await response
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
    let response = craneModel.read(ctx.params.id);
    await response
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
    let crane = ctx.request.body;
    let response = craneModel.create(crane);
    await response
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
    let id = ctx.params.id;
    let response = craneModel.destroy(id);
    await response
      .then(data => {
        ctx.body = data;
      })
      .catch(error => {
        ctx.status = 500;
        ctx.body = error.toString();
      });
  })

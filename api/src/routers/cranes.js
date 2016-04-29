import Router from 'koa-router'
import craneModel from '../models/crane'
import json from '../middleware/json_response';
import jsonBody from 'koa-json-body';

export default Router()
  .use(json(), jsonBody())
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
  // Lock this route with JWT token auth middleware
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
  // Lock this route with JWT token auth middleware
  .put('/cranes/:id', async (ctx) => {
    let crane = ctx.request.body;
    crane.id = ctx.params.id;
    await craneModel.update(crane)
      .then(data => {
        ctx.body = data;
      })
      .catch(error => {
        ctx.status = 500;
        ctx.body = error.toString();
      });
  })
  // Lock this route with JWT token auth middleware
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

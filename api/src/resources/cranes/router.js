import Router from 'koa-router';
import craneModel from './model';
import json from '../../middleware/json_response';
import jsonBody from 'koa-json-body';
import authMiddleware from '../../middleware/jwt_auth';

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
  .put('/cranes/:id', authMiddleware(), async (ctx) => {
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

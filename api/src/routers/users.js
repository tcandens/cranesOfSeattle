import Router from 'koa-router';
import userModel from '../models/user';
import json from '../middleware/json_response';
import jsonBody from 'koa-json-body';

export default Router()
  .use(json(), jsonBody())
  .get('/users/:id', async (ctx) => {
    await userModel.read(ctx.params.id)
      .then(data => {
        ctx.status = 200;
        ctx.body = data;
      })
      .catch(error => {
        ctx.status = 500;
        ctx.body = error.toString();
      });
  })
  .post('/users', async (ctx) => {
    await userModel.create(ctx.request.body)
      .then(data => {
        ctx.status = 201;
        ctx.body = data;
      })
      .catch(error => {
        ctx.status = 500;
        ctx.body = error.toString();
      });
  })

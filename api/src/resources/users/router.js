import Router from 'koa-router';
import userModel from './model';
import json from '../../middleware/json_response';
import jsonBody from 'koa-json-body';
import merge from 'lodash/merge';
import authMiddleware from '../../middleware/jwt_auth';

export default Router()
  .use(json(), jsonBody(), authMiddleware())
  .get('/users', async (ctx) => {
    if (!!ctx.query.by && ctx.query.by === 'points') {
      const offset = ctx.query.offset || 0;
      const limit = ctx.query.limit || 20;
      await userModel.getLeaders(offset, limit)
        .then(data => {
          ctx.status = 200;
          ctx.body = data;
        })
        .catch(error => {
          ctx.body = error.toString();
        })
    } else {
      await userModel.readAll()
      .then(data => {
        ctx.status = 200;
        ctx.body = data;
      })
      .catch(error => {
        ctx.body = error.toString();
      })
    }
  })
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
  .put('/users/:id', async (ctx) => {
    const updating = merge({}, ctx.request.body, {
      id: ctx.params.id
    });
    await userModel.update(updating)
      .then(data => {
        ctx.status = 200;
        ctx.body = {
          message: 'User updated.',
          result: data
        }
      })
      .catch(error => {
        ctx.status = 500;
        ctx.body = error.toString();
      })
  })

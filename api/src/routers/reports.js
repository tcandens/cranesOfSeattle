import Router from 'koa-router'
import reportModel from '../models/report'

export default Router()
  .get('/reports', async (ctx) => {
    await reportModel.readAll()
      .then(data => {
        ctx.body = {
          data: data
        };
      })
      .catch(error => {
        ctx.status = 500;
        ctx.body = error.toString();
      });
  })
  .get('/reports/within', async (ctx) => {
    await reportModel.findWithin(ctx.query)
      .then(data => {
        ctx.body = {
          data: data
        };
      })
      .catch(error => {
        ctx.status = 500;
        ctx.body = error.toString();
      });
  })
  .get('/reports/:id', async (ctx) => {
    await reportModel.read(ctx.params.id)
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
  .post('/reports', async (ctx) => {
    await reportModel.create(ctx.request.body)
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
  .put('/reports/:id', async (ctx) => {
    await reportModel.update(ctx.request.body)
      .then(data => {
        ctx.status = 200;
        ctx.body = {
          data: data,
          message: 'Report updated.'
        }
      })
      .catch(error => {
        ctx.status = 500;
        ctx.body = error.toString();
      });
  })
  .del('/reports/:id', async (ctx) => {
    await reportModel.destroy(ctx.params.id)
      .then(data => {
        ctx.status = 200;
        ctx.body = {
          message: 'Report destroyed.',
          data: data
        };
      })
      .catch(error => {
        ctx.status = 500;
        ctx.body = error.toString();
      });
  })

import Router from 'koa-router'
import reportModel from '../models/report'

export default Router()
  .get('/reports', async (ctx) => {
    let response = reportModel.readAll();
    await response
      .then(data => {
        ctx.body = data;
      })
      .catch(error => {
        ctx.status = 500;
        ctx.body = error.toString();
      });
  })
  .get('/reports/within', async (ctx) => {
    const response = reportModel.findWithin(ctx.query);
    await response
      .then(data => {
        ctx.body = data;
      })
      .catch(error => {
        ctx.status = 500;
        ctx.body = error.toString();
      });
  })
  .get('/reports/:id', async (ctx) => {
    let id = ctx.params.id;
    let response = reportModel.read(id);
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
  .post('/reports', async (ctx) => {
    let report = ctx.request.body;
    let response = reportModel.create(report);
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
  .put('/reports/:id', async (ctx) => {
    let report = ctx.request.body;
    report.id = ctx.params.id;
    let response = reportModel.update(report);
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
  .del('/reports/:id', async (ctx) => {
    let id = ctx.params.id;
    let response = reportModel.destroy(id);
    await response
      .then(data => {
        ctx.status = 200;
        ctx.body = data;
        // ctx.message = 'Report destroyed.';
      })
      .catch(error => {
        ctx.status = 500;
        ctx.body = error.toString();
      });
  })

import Router from 'koa-router';
import reportModel from './model';
import json from '../../middleware/json_response';
import jsonBody from 'koa-json-body';
import authMiddleware from '../../middleware/jwt_auth';

import sockets from '../../sockets';
import confirmationService from '../../services/reportConfirmation';

export default Router()
  .use(json(), jsonBody())
  .get('/reports', async (ctx) => {
    await reportModel.readAll()
      .then(data => {
        ctx.body = data;
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
        ctx.body = data;
        sockets.emit('report/add', data);
      })
      .catch(error => {
        ctx.status = 500;
        ctx.body = error.toString();
      });
  })
  .post('/reports', authMiddleware(), async (ctx) => {
    const report = ctx.request.body;
    await confirmationService(report)
      .then(confirmedReport => {
        ctx.status = 201;
        ctx.body = confirmedReport;
      })
      .catch(error => {
        ctx.status = 500;
        ctx.body = error.toString();
      });
  })
  .put('/reports/:id', authMiddleware(), async (ctx) => {
    let report = ctx.request.body;
    report.id = ctx.params.id;
    await reportModel.update(report)
      .then(data => {
        ctx.status = 200;
        ctx.body = data;
      })
      .catch(error => {
        ctx.status = 500;
        ctx.body = error.toString();
      });
  })
  .del('/reports/:id', authMiddleware(), async (ctx) => {
    await reportModel.destroy(ctx.params.id)
      .then(data => {
        ctx.status = 200;
        ctx.body = data;
      })
      .catch(error => {
        ctx.status = 500;
        ctx.body = error.toString();
      });
  })

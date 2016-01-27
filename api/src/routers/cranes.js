import Router from 'koa-router'
import craneModel from '../models/crane'

export default Router()
  .get('/cranes', async (ctx) => {
    await craneModel.readAll()
      .then(data => {
        ctx.body = {
          data: data
        }
      })
      .catch(error => {
        ctx.status = 500;
        ctx.body = error.toString();
      });
  })
  .get('/cranes/:id', async (ctx) => {
    await craneModel.read(ctx.params.id)
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
  .post('/cranes', async (ctx) => {
    await craneModel.create(ctx.request.body)
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
  .put('/cranes/:id', async (ctx) => {
    await craneModel.update(ctx.request.body)
      .then(data => {
        ctx.body = {
          data: data,
          message: 'Crane updated.'
        }
      })
      .catch(error => {
        ctx.status = 500;
        ctx.body = error.toString();
      });
  })
  .del('/cranes/:id', async (ctx) => {
    await craneModel.destroy(ctx.params.id)
      .then(data => {
        ctx.body = {
          message: 'Crane destroyed.',
          data: data
        };
      })
      .catch(error => {
        ctx.status = 500;
        ctx.body = error.toString();
      });
  })

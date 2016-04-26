import Router from 'koa-router';

export default Router()
  .get('/auth/google/callback', (ctx) => {
    ctx.body = `
      <h1>Authorized.</h1>
      <h2>Redirecting...</h2>
    `;
  })

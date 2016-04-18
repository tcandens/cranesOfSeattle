import Router from 'koa-router';

export default (passport) => {
  return Router()
    .get('/auth/google', passport.authenticate(
      'google',
      {
        scope: ['profile']
      }
    ))
    .get('/auth/google/callback',
      passport.authenticate('google', {failureRedirect: '/login'}),
      async (ctx) => {
        await ctx.redirect('/auth/received?id=' + ctx.req.user.id);
      }
    )
    .get('/auth/received', async (ctx) => {
      ctx.type = 'html';
      ctx.body = '<h1>Hello, world</h1>';
    });
}

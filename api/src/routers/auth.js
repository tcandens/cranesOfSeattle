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
        console.log(ctx.query);
        ctx.redirect('/login')
      }
    )
}

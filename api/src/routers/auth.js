import Router from 'koa-router';

export default function googleAuthRoutesFactory(passport) {
  return Router()
    .get(
      '/auth/google',
      passport.authenticate(
        'google',
        {
          scope: ['email']
        }
      )
    )
    .get(
      '/auth/google/callback',
      passport.authenticate(
        'google',
        {
          failureRedirect: '/auth/google/failure',
          successRedirect: '/auth/google/success'
        }
      ),
      (ctx) => {
        console.log(ctx.user);
      }
    )
}

import Router from 'koa-router';
import Debug from 'debug';
const debug = Debug('router/auth');

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
        debug(ctx.user);
      }
    )
}

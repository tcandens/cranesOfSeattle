import Router from 'koa-router';
import jwt from 'jsonwebtoken';

const TOKEN_SECRET = process.env.TOKEN_SECRET || 'Token Secret';

export default function googleAuthRoutesFactory(passport) {
  return Router()
    .get('/auth/google',
      passport.authenticate(
        'google',
        {
          session: false,
          scope: ['email']
        }
      )
    )
    .get('/auth/google/callback',
      passport.authenticate(
        'google',
        {
          session: false,
          failureRedirect: '/auth/failure'
        }
      ),
      async (ctx) => {
        const user = ctx.req.user;
        const token = jwt.sign(user, TOKEN_SECRET, {expiresIn: '100 days'});
        ctx.redirect(`/auth/success#token=${token}`);
      }
    )
    .get('/auth/facebook',
      passport.authenticate(
        'facebook', {
          session: false,
          scope: ['email']
        }
      )
    )
    .get('/auth/facebook/callback',
      passport.authenticate(
        'facebook', {
          session: false,
          failureRedirect: '/auth/failure'
        }
      ),
      async (ctx) => {
        const user = ctx.req.user;
        const token = jwt.sign(user, TOKEN_SECRET, {expiresIn: '100 days'});
        ctx.redirect(`/auth/success#token=${token}`);
      }
    )
    .get('/auth/failure', async (ctx) => {
      ctx.body = `Something went wrong. You should close this window and
      try again.`;
    })
    .get('/auth/success', async (ctx) => {
      ctx.body = `Success. This window should now close on its own.`;
    })
}

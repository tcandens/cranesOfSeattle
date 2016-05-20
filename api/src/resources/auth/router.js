import Router from 'koa-router';
import jwt from 'jsonwebtoken';

const TOKEN_SECRET = process.env.TOKEN_SECRET || 'Token Secret';

export default function googleAuthRoutesFactory(passport) {
  return Router()
    .get(
      '/auth/google',
      passport.authenticate(
        'google',
        {
          session: false,
          scope: ['email']
        }
      )
    )
    .get(
      '/auth/google/callback',
      passport.authenticate(
        'google',
        {
          session: false,
          failureRedirect: '/auth/google/failure'
        }
      ),
      async (ctx) => {
        const user = ctx.req.user;
        ctx.body = `
          <h1>Hello, ${user.name}</h1>
          <img src="${user.image_url}" />
          <h2>You are #${user.id}</h2>
          <p>Redirecting...</p>
        `;
        // Create & sign JWT token encoding user info
        const token = jwt.sign(user, TOKEN_SECRET, {expiresIn: '100 days'});
        ctx.redirect(`/api/auth#token=${token}`);
      }
    )
}

import jwt from 'jsonwebtoken';
export const TOKEN_SECRET = process.env.TOKEN_SECRET || 'Token Secret';

export default function (options = {}) {
  return async (ctx, next) => {
    if (!ctx.headers || !ctx.headers['Authorization']) {
      ctx.status = 501;
      ctx.body = {
        error: 'Not Authorized'
      }
      return next();
    }
    const token = ctx.headers['Authorization'].split(' ')[1];
    let verified = false;
    try {
      verified = jwt.verify(token, TOKEN_SECRET);
    } catch(error) {
      ctx.status = 501;
      ctx.body = {
        error: error.toString()
      }
    }
    if (verified) {
      await next();
    }
  }
}

import jwt from 'jsonwebtoken';
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'Token Secret';

export default function (options = {}) {
  return async (ctx, next) => {
    if (!ctx.headers || !ctx.headers.authorization) {
      ctx.status = 501;
      ctx.body = {
        error: 'Not Authorized'
      }
    }
    const token = ctx.headers['authorization'].split(' ')[1];
    console.log(token)
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

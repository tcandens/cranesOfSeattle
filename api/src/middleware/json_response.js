/**
 * Koa v2.x middleware that converts body to JSON.
 * @param  {object} options takes `replacer` or `spacer` for JSON.stringify()
 */
export default function (options = {}) {
  const replacer = options.replacer || null;
  const spacer = options.spacer || '\t';

  return async (ctx, next) => {
    await next();
    if (ctx.body) {
      ctx.set('Content-Type', 'application/json');
      ctx.body = JSON.stringify(ctx.body, replacer, spacer)
    }
  }
}

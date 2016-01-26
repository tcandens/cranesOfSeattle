export default function (version) {
  return async (ctx, next) => {
    ctx.response.set('API-Version', version);
    await next();
  }
}

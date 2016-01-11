import koa from 'koa'
import logger from 'koa-logger'
import json from 'koa-json'
import parseJson from 'koa-parse-json'

import cranes from './routers/cranes'

const PORT = process.env.PORT || 3000;

const app = koa();

app.use(parseJson());
app.use(json());
app.use(logger());

app
  .use(cranes.routes())
  .use(cranes.allowedMethods());

app.listen(PORT);

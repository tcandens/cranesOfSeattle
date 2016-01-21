import Koa from 'koa'
import logger from 'koa-logger'
import json from './middleware/json_response'
import jsonBody from 'koa-json-body'

import cranes from './routers/cranes'

const app = new Koa();

app.use(jsonBody());
app.use(json());
app.use(logger());

app
.use(cranes.routes())
  .use(cranes.allowedMethods());

export default app

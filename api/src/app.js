import Koa from 'koa'
import packageJSON from '../package.json'
import logger from 'koa-logger'
import json from './middleware/json_response'
import jsonBody from 'koa-json-body'
import version from './middleware/version'

import cranes from './routers/cranes'
import reports from './routers/reports'

const app = new Koa();

app.use(jsonBody());
app.use(json());
app.use(logger());
app.use(version(packageJSON.version));

app
  .use(cranes.routes())
  .use(reports.routes())

export default app

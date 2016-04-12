import Koa from 'koa';
const app = new Koa();

app.proxy = true;

/* Project Config */
import packageJSON from '../package.json';

/* Middleware */
import logger from 'koa-logger';
import json from './middleware/json_response';
import jsonBody from 'koa-json-body';
import version from './middleware/version';

app.use(jsonBody());
app.use(json());
app.use(logger());
app.use(version(packageJSON.version));

/* Routes */
import cranes from './routers/cranes';
import reports from './routers/reports';

app
  .use(cranes.routes())
  .use(reports.routes())

import authDecorator from './auth/decorator';
authDecorator(app);

export default app

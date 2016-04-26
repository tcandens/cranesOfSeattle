import Koa from 'koa';
const app = new Koa();

app.proxy = true;

/* Project Config */
import packageJSON from '../package.json';

/* Middleware */
import logger from 'koa-logger';
import version from './middleware/version';
import convert from 'koa-convert';
import session from 'koa-session';

app.use(logger());
app.use(version(packageJSON.version));

app.keys = ['SECRET_HERE'];
app.use(convert(session(app)));

/* Routes */
import cranes from './routers/cranes';
import reports from './routers/reports';

app
  .use(cranes.routes())
  .use(reports.routes())

// import authDecorator from './auth/decorator';
// authDecorator(app);

export default app

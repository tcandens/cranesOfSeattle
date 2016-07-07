import Koa from 'koa';
const app = new Koa();

app.proxy = true;

/* Project Config */
import packageJSON from '../package.json';

/* Middleware */
import version from './middleware/version';
import convert from 'koa-convert';
import session from 'koa-session';

app.use(version(packageJSON.version));

app.keys = ['SECRET_HERE'];
app.use(convert(session(app)));

/* Routes */
import cranes from './resources/cranes/router';
import reports from './resources/reports/router';
import users from './resources/users/router';

app
  .use(cranes.routes())
  .use(reports.routes())
  .use(users.routes())

import authDecorator from './resources/auth/decorator';
authDecorator(app);

import notificationsDecorator from './notifications';
notificationsDecorator(app);

export default app

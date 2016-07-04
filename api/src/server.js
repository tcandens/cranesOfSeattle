import 'babel-core/register';
import 'babel-polyfill';

import app from './app';
import sockets from './sockets';

let PORT = process.env.PORT || 3000;
if (process.env.ENV === 'test') PORT = 3333;

const server = app.listen(PORT);
import http from 'http';
const socketServer = http.Server(app.callback());
sockets.listen(socketServer);

export default server;

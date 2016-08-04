import pg from './connections/postgres';
import SocketIO from 'koa-socket';

const db = pg.init().instance;
const io = new SocketIO();

export default function notificationsDecorator(app) {
  io.attach(app);
  db.connect({direct: true})
    .then(obj => {
      obj.client.on('notification', data => {
        handleNotification(data);
      });
      return obj.none('LISTEN $1~', 'watchers');
    })
    .catch(error => {
      console.log('PGQL connection error:', error);
    })
  function addReport(report) {
    app.io.broadcast('report/added', report);
  }
  function addCrane(crane) {
    app.io.broadcast('crane/added', crane);
  }
  const resourceLookup = {
    reports: addReport,
    cranes: addCrane
  }
  function handleNotification(data) {
    let payload;
    try {
      payload = JSON.parse(data.payload);
    } catch(e) {
      payload = e;
    }
    const resource = payload.resource;
    delete payload.resource;
    resourceLookup[resource](payload);
  }
  return app;
}

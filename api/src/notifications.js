import db from './connections/postgres';
import SocketIO from 'koa-socket';

const connection = db.getConnection();
const io = new SocketIO();

export default function notificationsDecorator(app) {
  io.attach(app);
  connection.on('notification', data => {
    let payload;
    try {
      payload = JSON.parse(data.payload);
    } catch(e) {
      payload = e;
    }
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
    const resource = payload.resource || 'reports';
    delete payload.resource;
    resourceLookup[resource](payload);
  });
  connection.connect();
  connection.query('LISTEN watchers')
  return app;
}

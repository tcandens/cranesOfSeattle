import info from './info'
import options from './options'
import pgp from 'pg-promise'
import monitor from 'pg-monitor'

/* Turn off database logging for tests */
if (process.env.ENV !== 'TEST') {
  monitor.attach(options);
}

function getConnection() {
  const pg = pgp(options).pg;
  const client = new pg.Client(info);
  return client;
}

let singleton = null;

function init() {
  if (singleton) return singleton;
  singleton = {
    factory: pgp(options)
  }
  singleton.instance = singleton.factory(info);
  return singleton;
}

export default {
  init: init,
  getConnection: getConnection
}

import info from './info'
import options from './options'
import pgp from 'pg-promise'
import monitor from 'pg-monitor'
import {winstonInstance} from '../../middleware/logger';

/* Turn off database logging for tests */
if (process.env.ENV !== 'TEST') {
  monitor.attach(options);
  monitor.log = (message, info) => {
    winstonInstance.info(`
      POSTGRES
      --------
      ${info.time} - ${info.event}
      ${message}
      ========
      `);
  }
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
  init: init
}

import info from './info'
import options from './options'
import pgp from 'pg-promise'
import monitor from 'pg-monitor'

/* Turn off database logging for tests */
if (process.env.ENV !== 'TEST') {
  monitor.attach(options);
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

import info from './db_info'
import options from './db_options'
import pgp from 'pg-promise'
import monitor from 'pg-monitor'

monitor.attach(options);

export default function main() {
  const db = {
    pg: pgp(options)
  }
  db.cn = db.pg(info);
  return db;
}

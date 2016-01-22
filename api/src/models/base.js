import { assign } from 'lodash'
import db from '../connections/db'

const __database = db.init();

const prototype = {
  __database: __database,
  close: () => {
    __database.factory.end();
  },
  db: __database.instance,
  tableName: 'default',
  create(model) {
  },
  read(id) {
  },
  readAll() {
    const res = this.db.manyOrNone(`SELECT * FROM ${this.tableName}`)
      .finally(this.close())
    return res;
  },
  update(fields) {
  },
  destroy(id) {
  },
  __destroyAll__() {
    // return this.database.cn.none(`DELETE FROM ${this.tableName}`)
    const res = this.db.query(`DELETE FROM ${this.tableName}`)
      .finally(this.close())
  }
}

// Export factory
export default function (name, options) {
  return assign(prototype, {
    tableName: name
  }, options);
}

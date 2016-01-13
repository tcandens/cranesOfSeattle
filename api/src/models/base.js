import { assign } from 'lodash'
import db from '../connections/db'

const __database = db.init();

// A parent that will hold default model behavior
const prototype = {
  __database: __database,
  db: __database.instance,
  tableName: 'default',
  fetchAll() {
    // Rewrite with bluebirds .finally to close connections
    const res = this.db.manyOrNone(`SELECT * FROM ${this.tableName}`)
      .finally(this.__database.factory.end())
    return res;
  },
  __clean__() {
    // return this.database.cn.none(`DELETE FROM ${this.tableName}`)
  }
}

// Export factory
export default function (name, options) {
  return assign(prototype, {
    tableName: name
  }, options);
}

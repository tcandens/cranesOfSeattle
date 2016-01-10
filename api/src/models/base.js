import { assign } from 'lodash'
import db from '../../connections/db'

// A parent that will hold default model behavior
const prototype = {
  database: db,
  tableName: 'default',
  fetchAll() {
    return this.database.manyOrNone(`SELECT * FROM ${this.tableName}`);
  },
  __clean__() {
    return this.database.none(`DELETE FROM ${this.tableName}`)
  }
}

export default function (name, options) {
  return assign(prototype, {
    tableName: name
  }, options);
}

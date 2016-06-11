import { create } from 'lodash'
import db from '../connections/postgres'

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
    const query = `
      SELECT * FROM ${this.tableName} WHERE id = $1
    `;
    const response = this.db.one(query, id)
      .finally(this.close());
    return response;
  },
  readAll() {
    const query = `
      SELECT * FROM ${this.tableName}
    `;
    const response = this.db.manyOrNone(query)
      .finally(this.close())
    return response;
  },
  update(fieldObject) {
    const query = `
      UPDATE ${this.tableName} SET $/key~/ = $/value/ WHERE id = $/id/
    `;
    const response = this.db.none(query, fieldObject)
    return response;
  },
  destroy(id) {
    const query = `
      DELETE FROM ${this.tableName} WHERE id = $1
    `;
    const response = this.db.none(query, id)
      .finally(this.close());
    return response;
  },
  __destroyAll__() {
    return this.db.query(`DELETE FROM ${this.tableName}`)
  }
}

// Export factory
export default function (name, options) {
  return create(prototype, {
    tableName: name
  }, options);
}

import modelFactory from './base'
import { merge } from 'lodash'

const craneModel = modelFactory('cranes');

craneModel.create = function(crane) {
  const query = `INSERT INTO ${this.tableName}
  (location, user_id, permit, address, expiration_date)
  VALUES (
    ST_GeomFromGeoJSON($/geometry/),
    $/user_id/,
    $/permit/,
    $/address/,
    $/expiration_date/
  )
  RETURNING ID`;
  const response = this.db.one(query, merge(crane, crane.properties))
    .finally(this.close());
  return response;
};

craneModel.read = function(id) {
  const query = `SELECT
    ST_AsGeoJSON(location) AS geometry,
    permit,
    address,
    expiration_date,
    user_id
  FROM ${this.tableName} WHERE id = $1;`;
  const response = this.db.one(query, id)
    // .all(data => {
    //   console.log('All promises:', data);
    // })
    .finally(this.close());
  return response;
}

export default craneModel

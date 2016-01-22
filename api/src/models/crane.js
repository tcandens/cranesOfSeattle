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

export default craneModel

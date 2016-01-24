import modelFactory from './base'
import { merge } from 'lodash'

const craneModel = modelFactory('cranes');

craneModel.create = function(crane) {
  const query = `
    INSERT INTO ${this.tableName}
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
  const query = `
    SELECT 'Feature' AS type,
    ST_AsGeoJSON(location)::json AS geometry,
    row_to_json(
      (SELECT l FROM
        (SELECT
          permit,
          address,
          expiration_date,
          user_id,
          id
        ) AS l
      )
    ) AS properties
    FROM ${this.tableName} AS l WHERE l.id = $1`;
  const response = this.db.one(query, id)
    .finally(this.close());
  return response;
};

export default craneModel

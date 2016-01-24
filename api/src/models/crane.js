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

craneModel.readAll = function() {
  const query = `
    SELECT row_to_json(fc) FROM
      (SELECT 'FeatureCollection' AS type, array_to_json(array_agg(f)) AS features
        FROM (SELECT 'Feature' AS type,
          ST_AsGeoJSON(l.location)::json AS geometry,
          row_to_json(
            (SELECT r FROM
              (SELECT
                permit,
                address,
                expiration_date,
                user_id,
                id
              ) AS r
            )) AS properties FROM ${this.tableName} AS l
        ) AS f
      ) AS fc
  `;
  const response = this.db.manyOrNone(query)
    .finally(this.close());
  return response;
}

export default craneModel

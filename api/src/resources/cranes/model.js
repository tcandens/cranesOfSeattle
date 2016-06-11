import modelFactory from '../../lib/sqlModelFactory';
import { merge, defaults } from 'lodash'

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
    FROM ${this.tableName} AS l WHERE l.id = $1
  `;
  const response = this.db.oneOrNone(query, id)
    .finally(this.close());
  return response;
};

craneModel.readAll = function() {
  const query = `
    SELECT 'FeatureCollection' as type,
    json_build_object('name', '${this.tableName}') as properties,
    COALESCE(array_to_json(array_agg(f)), '[]') as features FROM (
      SELECT 'Feature' as type,
      ST_AsGeoJSON(r.location)::json as geometry,
      row_to_json((SELECT l FROM (SELECT id, permit) AS l)) AS properties
      FROM ${this.tableName} AS r
    ) AS f
  `;
  const response = this.db.one(query)
    .finally(this.close());
  return response;
};

craneModel.findWithin = function(querystring) {
  const options = defaults(querystring, {
    radius: 1
  });
  const query = `
    SELECT 'FeatureCollection' as type,
    COALESCE(array_to_json(array_agg(f)), '[]') as features FROM (
      SELECT 'Feature' as type,
      ST_AsGeoJSON(r.location)::json as geometry,
      row_to_json((SELECT l FROM (SELECT id, user_id) AS l)) AS properties
      FROM ${this.tableName} AS r WHERE ST_DWithin(
        r.location, 'POINT($/lng/ $/lat/)', $/radius/
      )
    ) AS f
  `;
  const response = this.db.one(query, options)
  return response;
}

export default craneModel

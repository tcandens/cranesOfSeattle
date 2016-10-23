import modelFactory from '../../lib/sqlModelFactory';
import {merge, defaults} from 'lodash'

const craneModel = modelFactory('cranes');

craneModel.create = function(crane) {
  const query = `
    INSERT INTO ${this.tableName}
    (location, user_id, permit, address, expiration_date, confidence)
    VALUES (
      ST_GeomFromGeoJSON($/geometry/),
      $/user_id/,
      $/permit/,
      $/address/,
      $/expiration_date/,
      $/confidence/
    )
    RETURNING
    'Feature' AS type,
    ST_AsGeoJSON(location)::json AS geometry,
    json_build_object(
      'id', id,
      'user_id', user_id,
      'confidence', confidence,
      'permit', permit,
      'address', address,
      'expiration_date',expiration_date,
      'created_at', created_at
    ) AS properties
  `;
  return this.db.one(query, merge(crane, crane.properties));
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
    FROM ${this.tableName} AS l
    WHERE l.id = $1
  `;
  return this.db.oneOrNone(query, id);
};

craneModel.readAll = function() {
  const query = `
    SELECT 'FeatureCollection' as type,
    json_build_object('name', '${this.tableName}') as properties,
    COALESCE(array_to_json(array_agg(f)), '[]') as features FROM (
      SELECT 'Feature' as type,
      ST_AsGeoJSON(r.location)::json as geometry,
      row_to_json((SELECT l FROM (SELECT id, permit, user_id) AS l)) AS properties
      FROM ${this.tableName}
      AS r
      WHERE r.expiration_date >= DATE(NOW())
    ) AS f
  `;
  return this.db.one(query);
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
  return this.db.one(query, options);
}

export default craneModel

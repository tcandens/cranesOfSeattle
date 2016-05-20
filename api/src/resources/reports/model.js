import modelFactory from '../../lib/sqlModelFactory';
import { defaults, merge } from 'lodash';

const reportModel = modelFactory('reports');

reportModel.create = function(report) {
  const query = `
    INSERT INTO ${this.tableName}
    (location, user_id, confidence)
    VALUES (
      ST_GeomFromGeoJSON($/geometry/),
      $/user_id/,
      $/confidence/
    )
    RETURNING ID`;
  return this.db.one(query, merge(report, report.properties))
};

reportModel.read = function(id) {
  const query = `
    SELECT 'Feature' AS type,
    ST_AsGeoJSON(location)::json AS geometry,
    row_to_json(
      (SELECT l FROM
        (SELECT
          user_id,
          id
        ) AS l
      )
    ) AS properties
    FROM ${this.tableName} AS l WHERE l.id = $1
  `;
  return this.db.one(query, id);
}

reportModel.readAll = function() {
  const query = `
    SELECT 'FeatureCollection' as type,
    json_build_object('name', '${this.tableName}') as properties,
    COALESCE(array_to_json(array_agg(f)), '[]') as features FROM (
      SELECT 'Feature' as type,
      ST_AsGeoJSON(r.location)::json as geometry,
      row_to_json((SELECT l FROM (SELECT id, user_id) AS l)) AS properties
      FROM ${this.tableName} AS r
    ) AS f
  `;
  return this.db.one(query);
}

reportModel.findWithin = function(querystring) {
  const options = defaults(querystring, {
    radius: 1
  });
  const query = `
    SELECT 'FeatureCollection' as type,
    array_to_json(array_agg(f)) as features FROM (
      SELECT 'Feature' as type,
      ST_AsGeoJSON(r.location)::json as geometry,
      row_to_json((SELECT l FROM (SELECT id, user_id) AS l)) AS properties
      FROM ${this.tableName} AS r WHERE ST_DWithin(
        r.location, 'POINT($/lng/ $/lat/)', $/radius/
      )
    ) AS f
  `;
  return this.db.manyOrNone(query, options);
}

export default reportModel;

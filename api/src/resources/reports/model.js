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
    RETURNING
    'Feature' AS type,
    ST_AsGeoJSON(location)::json AS geometry,
    json_build_object('id', id, 'user_id', user_id, 'confidence', confidence)
    AS properties
    `;
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
          l.id,
          confidence,
          image_url AS user_image_url,
          points AS user_points,
          name AS user_name
        ) AS l
      )
    ) AS properties
    FROM ${this.tableName} AS l
    INNER JOIN users AS u ON l.user_id = u.id
    WHERE l.id = $1
  `;
  return this.db.oneOrNone(query, id);
}

reportModel.readAll = function() {
  const query = `
    SELECT 'FeatureCollection' as type,
    json_build_object('name', '${this.tableName}') as properties,
    COALESCE(array_to_json(array_agg(f)), '[]') as features FROM (
      SELECT 'Feature' as type,
      ST_AsGeoJSON(r.location)::json as geometry,
      row_to_json((SELECT l FROM (SELECT r.id, user_id, confidence, image_url AS user_image_url, name AS user_name, points AS user_points) AS l)) AS properties
      FROM ${this.tableName} AS r
      INNER JOIN users AS u ON r.user_id = u.id
    ) AS f
  `;
  return this.db.one(query);
}

reportModel.findWithin = function(querystring) {
  const options = defaults(querystring, {
    radius: 1,
    userId: null
  });
  const query = `
    SELECT 'FeatureCollection' as type,
    COALESCE(array_to_json(array_agg(f)), '[]') as features FROM (
      SELECT 'Feature' as type,
      ST_AsGeoJSON(r.location)::json as geometry,
      COALESCE(row_to_json((SELECT l FROM (SELECT id, user_id, confidence) AS l))) AS properties
      FROM ${this.tableName} AS r WHERE ST_DWithin(
        r.location, 'POINT($/lng/ $/lat/)', $/radius/
      )
      AND r.user_id != $/userId/
    ) AS f
  `;
  return this.db.one(query, options);
}

export default reportModel;

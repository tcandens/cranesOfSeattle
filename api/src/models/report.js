import modelFactory from './base'
import { merge } from 'lodash'

const reportModel = modelFactory('reports');

reportModel.create = function(report) {
  const query = `
    INSERT INTO ${this.tableName}
    (location, user_id)
    VALUES (
      ST_GeomFromGeoJSON($/geometry/),
      $/user_id/
    )
    RETURNING ID`;
  const response = this.db.one(query, merge(report, report.properties))
    .finally(this.close());
  return response;
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
  const response = this.db.one(query, id);
  return response;
}

reportModel.readAll = function() {
  const query = `
    SELECT 'FeatureCollection' as type,
    array_to_json(array_agg(f)) as features FROM (
      SELECT 'Feature' as type,
      ST_AsGeoJSON(r.location)::json as geometry,
      row_to_json((SELECT l FROM (SELECT id, user_id) AS l)) AS properties
      FROM ${this.tableName} AS r
    ) AS f
  `;
  const response = this.db.one(query)
    .finally(this.close());
  return response;
}

export default reportModel;

import modelFactory from './base'
import { keys } from 'lodash'

const craneModel = modelFactory('cranes');

craneModel.report = function(crane) {

  // Reformat location for PostGIS
  crane.location = `POINT(${crane.location.latitude} ${crane.location.longitude})`;
  const query = `INSERT INTO ${this.tableName}
    ( name, location )
    VALUES ( $1, ST_GeomFromText($2) )
    RETURNING id`;
  return this.database.one(query, [crane.name, crane.location]);
};

export default craneModel

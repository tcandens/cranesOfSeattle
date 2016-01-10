import modelFactory from './base'
import { create } from 'lodash'

const craneModel = modelFactory('cranes');

create(craneModel, {
  addCrane(location) {
    this.location = location;
    const db = this.database;
    const name = this.name;

    return db.query(`INSERT INTO ${name} (name, location),
      VALUES ('test crane', ST_GeogFromText('$1 $2'))`,
      [location.latitude, location.longitude]);
  }
})

export default craneModel

import * as _ from 'lodash'
import db from '../../connections/db'

// A parent that will hold default model behavior
const modelPrototype = {
  name: 'defaultModel'
};

export default function (name, options) {

  this.database = db;
  this.name = name;

  return this;
}

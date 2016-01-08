import * as _ from 'lodash'

// A parent that will hold default model behavior
const modelPrototype = {
  name: 'defaultModel'
};

export default function (name, options) {

  /**
   * Use default connection to database unless overridden by options.
   */
  const _db = options && options.db ? options.db : require('../connections/db');

  /**
   * Parse name into acceptable string for database table name
   */
  const _name = _.chain(name).trim('_-.').camelCase().value();

  /**
   * Check database to see if table `name` exists and
   * if it doesn't exist, create it.
   */
  function ensureTableExists(tableName) {
    db.query(`create table if not exist $1`, [tableName])
  }

  /**
   * Internal model to override modelPrototype.
   */
  const _model = {
    // Sanitize name to be used in database table
    name: _name
  }

  return _.assign(modelPrototype, _model);
}

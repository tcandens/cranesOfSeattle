import * as _ from 'lodash'

// A parent that will hold default model behavior
const modelPrototype = {
  name: 'defaultModel',
  schema: {}
};


// Checks if database has a table that is named after the model
// else, makes one.

// A method to get all records

export default function (name) {

  /**
   * Check database to see if table `name` exists.
   * If it doesn't exist, create it.
   */
  function ensureTableExists() {

  }

  const _name = _.chain(name).trim('_-.').camelCase().value();
  // some regex logic about the naming of table
  const _model = {
    // Sanitize name to be used in database table
    name: _name
  }
  return _.assign(modelPrototype, _model);
}

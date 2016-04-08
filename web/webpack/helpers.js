const path = require('path');

const createAliasesFrom = (root) => {
  return {
    to: (names) => {
      return names.reduce((result, value) => {
        result[String(value)] = path.resolve(root, value);
        return result;
      }, {});
    }};
};

module.exports = {
  alias: createAliasesFrom
};

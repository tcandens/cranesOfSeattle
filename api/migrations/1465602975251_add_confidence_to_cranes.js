exports.up = function(pgm) {
  pgm.addColumns('cranes', {
    'confidence': {
      type: 'integer'
    }
  });
};

exports.down = function(pgm) {
  pgm.dropColumns('cranes', ['confidence']);
};

exports.up = function(pgm) {
  pgm.addColumns('reports', {
    'confidence': {
      type: 'integer'
    }
  });
};

exports.down = function(pgm) {
  pgm.dropColumns('reports', ['confidence']);
};

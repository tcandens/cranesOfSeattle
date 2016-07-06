exports.up = function(pgm) {
  pgm.addColumn('users', {
    points: 'integer'
  });
};

exports.down = function(pgm) {
  pgm.dropColumn('users', ['points'])
};

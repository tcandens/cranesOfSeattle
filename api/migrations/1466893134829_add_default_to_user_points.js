exports.up = function(pgm) {
  pgm.alterColumn('users', 'points', {
    default: '0'
  });
};

exports.down = function(pgm) {
  pgm.alterColumn('users', 'points', {
    default: null
  })
};

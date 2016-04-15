exports.up = function(pgm) {
  pgm.alterColumn('users', 'id', {
    type: 'bigint'
  });
};

exports.down = function(pgm) {
  pgm.alterColumn('users', 'id', {
    type: 'integer'
  });
};

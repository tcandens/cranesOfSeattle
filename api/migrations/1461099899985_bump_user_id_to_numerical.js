exports.up = function(pgm) {
  pgm.alterColumn('reports', 'user_id', {
    type: 'numeric',
    notNull: true
  });
  pgm.alterColumn('cranes', 'user_id', {
    type: 'numeric',
    notNull: true
  });
};

exports.down = function(pgm) {
  pgm.alterColumn('reports', 'user_id', {
    type: 'integer',
    notNull: false
  });
  pgm.alterColumn('cranes', 'user_id', {
    type: 'integer'
  });
};

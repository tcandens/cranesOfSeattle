exports.up = function(pgm) {
  pgm.createTable('reports', {
    id: 'id',
    location: {
      type: 'geography(POINT, 4326)',
      notNull: true
    },
    user_id: 'integer'
  });
};

exports.down = function(pgm) {
  pgm.dropTable('reports');
};

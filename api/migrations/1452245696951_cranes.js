exports.up = function(pgm) {
  pgm.createTable('cranes', {
    id: 'id',
    location: {
      type: 'geography(POINT, 4326)',
      notNull: true
    },
    name: 'string'
  });
};

exports.down = function(pgm) {
  pgm.droptable('cranes');
};

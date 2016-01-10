exports.up = function(pgm) {
  pgm.createTable('cranes', {
    id: 'id',
    location: {
      type: 'geography(POINT, 4326)',
      notNull: true
    },
    name: {
      type: 'varchar(40)',
      notNull: true
    },
    permit: {
      type: 'text',
      notNull: false
    }
  });
};

exports.down = function(pgm) {
  pgm.dropTable('cranes');
};

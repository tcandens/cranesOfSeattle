exports.up = function(pgm) {
  pgm.createTable('cranes', {
    id: 'id',
    location: {
      type: 'geography(POINT, 4326)',
      notNull: true
    },
    user_id: {
      type: 'integer',
      notNull: true
    },
    permit: 'integer',
    expiration_date: {
      type: 'date'
    },
    address: {
      type: 'varchar(60)',
      notNull: true
    }
  });
};

exports.down = function(pgm) {
  pgm.dropTable('cranes');
};

exports.up = function(pgm) {
  pgm.createTable('users', {
    id: 'id',
    name: {
      type: 'varchar',
      notNull: true
    },
    email: {
      type: 'varchar',
      notNull: true
    }
  });
};

exports.down = function(pgm) {
  pgm.dropTable('users');
};

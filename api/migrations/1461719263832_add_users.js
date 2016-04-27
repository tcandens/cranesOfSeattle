exports.up = function(pgm) {
  pgm.createExtension('citext')
  pgm.createTable('users', {
    id: 'id',
    google_id: {
      type: 'numeric',
      notNull: true
    },
    name: {
      type: 'varchar(50)',
      notNull: true
    },
    email: {
      type: 'citext',
      notNull: true,
      unique: true
    },
    image_url: {
      type: 'text',
      notNull: false
    }
  })
};

exports.down = function(pgm) {
  pgm.dropTable('users');
  pgm.dropExtension('citext')
};

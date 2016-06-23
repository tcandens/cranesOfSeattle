exports.up = function(pgm) {
  pgm.addColumns('users', {
    facebook_id: {
      type: 'numeric'
    }
  });
  pgm.alterColumn('users', 'google_id', {
    notNull: false
  });
};

exports.down = function(pgm) {
  pgm.dropColumns('users', 'facebook_id');
  pgm.alterColumn('users', 'google_id', {
    notNull: true
  });
};

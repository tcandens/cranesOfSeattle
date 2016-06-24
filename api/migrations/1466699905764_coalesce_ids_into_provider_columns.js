exports.up = function(pgm) {
  pgm.dropColumns('users', ['google_id', 'facebook_id']);
  pgm.addColumns('users', {
    'auth_provider_id': {
      type: 'numeric',
      notNull: true
    },
    'auth_provider': {
      type: 'varchar(20)',
      notNull: true
    }
  });
};

exports.down = function(pgm) {
  pgm.addColumns('users', {
    'google_id': {
      type: 'numeric'
    },
    'facebook_id': {
      type: 'numeric'
    }
  });
  pgm.dropColumns('users', ['auth_provider, auth_provider_id']);
};

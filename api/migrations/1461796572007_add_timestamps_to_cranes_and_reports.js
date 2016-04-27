exports.up = function(pgm) {
  pgm.addColumns('reports', {
    created_at: {
      type: 'TIMESTAMPTZ NOW()'
    }
  });
  pgm.addColumns('cranes', {
    created_at: {
      type: 'TIMESTAMPTZ NOW()'
    }
  });
};

exports.down = function(pgm) {
  pgm.dropCOlumns('reports', ['created_at']);
  pgm.dropColumns('cranes', ['created_at']);
};

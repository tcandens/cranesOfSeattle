let host;
if (process.env.ENV === 'test') {
  host = process.env.TESTDB_PORT_5432_TCP_ADDR;
} else {
  host = process.env.DB_PORT_5432_TCP_ADDR || 'localhost';
}

export default {
  host: host,
  port: process.env.DB_PORT_5432_TCP_PORT || 5432,
  database: process.env.PGDATABASE || 'postgres',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'mysecretpassword'
};

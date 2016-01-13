import bluebird from 'bluebird'

const options = {
  promiseLib: bluebird,
  connect: (client) => {
    var info = client.connectionParameters;
    console.log('Connected to database', info.database);
  },
  disconnect: (client) => {
    var cp = client.connectionParameters;
    console.log('Disconnecting from database', cp.database);
  },
  error: (err, e) => {
    console.log('Error:', err);
    if (e.query) {
      console.log('Query:', e.query);
      if (e.params) {
        console.log('Parameters:', e.params);
      }
    }
  }
};

export default options

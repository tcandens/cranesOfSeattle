export var options = {
  connect: (client) => {
    var info = client.connectionParameters;
    console.log('Connected to database:' + info.database);
  }
};


# TODO

## API
* Use a test database, probably a docker container that is not run through main
docker-compose file. Perhaps a separate test-compose. The problem is running
migrations for the database, i.e. when where how?
  - OPTIONS:
  - Keep it simple and run a db container with docker from child_process.exec
  inside the API integration file since these should be the only tests that need
  a database.
  - Expose only the test database ports in main docker-compose file, but then
  take local node installation for granted.
  - `npm test` could be a compose file that runs tests from within containers and
  has watch tasks.
* Perhaps knex.js is not a bad idea. Learning about SQL and how to manage connections
is great, but slow.
* Setup a watch task to auto-run tests.
* Superagent over Axios?
* Move NPM tasks over to Gulp. Will be cleaner and more extendable as well as
prevent docker image rebuilds when altering tasks.
* Version the api.

## CLIENT

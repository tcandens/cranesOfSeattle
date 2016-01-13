# TODO

## API
* Setup a watch task to auto-run tests.
* Try using separate database container for testing via Docker and
some shell script?
  * Right now, database container port is mapped to host through dev compose
  file but this will lead to polluting our database with useless data.
* Database leaves Tape tests hanging
  * Find a way to manually disconnect database.

## CLIENT

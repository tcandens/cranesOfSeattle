#!/bin/bash

set -e

export DATABASE_URL=db://${PGUSER}:${PGPASSWORD}@db/${PGDATABASE}

if [ "$ENV" = 'DEV' ]; then
  echo $'Running Development Server\n--------------------------'
  ./node_modules/.bin/pg-migrate up;
  npm start;
elif [ "$ENV" = 'TEST' ]; then
  export PORT=3333
  echo $'Running Tests\n-------------';
  ls -a ./node_modules/.bin/
  ./node_modules/.bin/pg-migrate up;
  npm test;
else
  echo "Running Production Server"
  echo "-------------------------"
  npm run production
fi

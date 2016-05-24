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
  ./node_modules/.bin/pg-migrate up;
  npm run tests;
else
  echo "Running Production Server"
  echo "-------------------------"
  # Change this to PM2 or Forever task
  npm run production
fi

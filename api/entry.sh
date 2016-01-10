#!/bin/bash

set -e

if [ "$ENV" = 'DEV' ]; then
  echo "Running Development Server"
  echo "--------------------------"
  # exec ./node_modules/.bin/pg-migrate up
  exec npm run dev
else
  echo "Running Production Server"
  exec node dist/server.js
fi

#!/bin/bash

set -e

if [ "$ENV" = 'DEV' ]; then
  echo "Running Development Server"
  echo "--------------------------"
  exec ./node_modules/.bin/babel-node ./migrations/extensions.js
  exec npm run dev
else
  echo "Running Production Server"
  exec node dist/server.js
fi

#!/bin/bash

set -e

if [ "$ENV" = 'DEV' ]; then
  echo "Running Development Server"
  exec /var/www/api/node_modules/nodemon/bin/nodemon.js -L \
    /var/www/api/src/server.js \
    -w /var/www/api/src/ \
    -e js
else
  echo "Running Production Server"
  exec node /var/www/api/src/server.js
fi

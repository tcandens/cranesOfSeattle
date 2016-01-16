#!/bin/bash

set -e

# # Test to make sure linked ports are open
# host=$(env | grep -m 1 _TCP_ADDR | cut -d = -f 2)
# port=$(env | grep -m 1 _TCP_PORT | cut -d = -f 2)
#
# echo -n "Waiting for connection at $host:$port..."
#
# while ! nc $host $port 2>/dev/null 2>$1 < /dev/null;
# do
#   echo -n .
#   sleep 1
# done
#
# echo 'OK'


if [ "$ENV" = 'DEV' ]; then
  echo $'Running Development Server\n--------------------------'
  # exec ./node_modules/.bin/pg-migrate up
  exec npm run dev
elif [ "$ENV" = 'TEST' ]; then
  echo $'Running Tests\n-------------'
  # exec ./node_modules/.bin/pg-migrate up
  exec npm run watch-test
else
  echo "Running Production Server"
  echo "-------------------------"
  # Change this to PM2 or Forever task
  exec node dist/server.js
fi

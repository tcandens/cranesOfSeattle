#!/bin/bash

set -e

# # Test to make sure linked ports are open
host=$(env | grep -m 1 _TCP_ADDR | cut -d = -f 2)
port=$(env | grep -m 1 _TCP_PORT | cut -d = -f 2)

echo -n "Waiting for connection at $host:$port..."

i=0
while ! exec 6<>/dev/tcp/${host}/${port};
do
  i=`expr $i + 1`
  if [ $i -ge 10 ]; then
    echo "Database unavailable. Giving up."
    exit 1
  fi
  echo -n .
  sleep 1
done
echo 'OK'

exec 6>&-
exec 6<&-
export DATABASE_URL=db://postgres:mysecretpassword@${host}/test

if [ "$ENV" = 'DEV' ]; then
  echo $'Running Development Server\n--------------------------'
  exec ./node_modules/.bin/pg-migrate up >/dev/null && npm run dev
elif [ "$ENV" = 'TEST' ]; then
  export PORT=3333
  echo $'Running Tests\n-------------';
  ./node_modules/.bin/pg-migrate up;
  npm run watch-test;
  # exec npm run dev
else
  echo "Running Production Server"
  echo "-------------------------"
  # Change this to PM2 or Forever task
  exec node dist/server.js
fi

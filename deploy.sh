#!/usr/bin/sh
#
# create git remote using env variables to keep deployment info private.
git remote add deploy ${PROD_SERVER_URL}

# push branch to deploy remote
git push deploy master

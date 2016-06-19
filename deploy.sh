#!/usr/bin/env bash
# create git remote using env variables to keep deployment info private.
git remote add deploy ${GIT_DEPLOY_REMOTE}
# push branch to deploy remote
git push deploy master

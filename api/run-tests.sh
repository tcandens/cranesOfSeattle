#!/bin/bash

# Test if Docker-compose command is available
command -v docker-compose>/dev/null 2>&1 || { echo "Error: Docker-compose is
required. Please visit https://docs.docker.com/compose/"; exit 1; }
# Docker-compose build image for testing
echo "> Building from test-docker-compose.yml"
docker-compose -f test-docker-compose.yml build
echo "> Booting containers"
docker-compose -f test-docker-compose.yml up

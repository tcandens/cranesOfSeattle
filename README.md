# Docker-Compose-Example
An example using Docker and Docker-compose to create a development environment with quasi-microservices or containers

## Goals
This setup is for the moment focused on providing a portable and flexible development environment using Docker but room is left for production settings.

## Stack
On the front-end, the development setup provides a Webpack-dev-serve with React-Hot-Loader and ES6. Right now, there is no working Webpack production build task.
For the API backend, a node container will run Nodemon with an Babel ES6 compilation. The server is running Koa.js to provide the API and to communicate with the PostGRES container for persistence.
All of this is proxied by Nginx do deal with CORS issues and to provide a close-to-production setup. Eventually, a production configuration for Nginx will continue to proxy the API server but will serve static built assets instead of Webpack-dev-server.

## Setup
### Requirements
- Docker
- Docker-compose

After installing Docker and Docker compose, you should be able to simply run `docker-compose build` within the root of this project. This will take a long while as docker pulls the required images and then builds from the included Dockerfiles. After building, run `docker-compose up` and there should be output for all running containers.

# The Cranes of Seattle
Crowdsourced web application for visualizing the tower cranes erected in
Seattle, Washington. This project includes an API and frontend.

## Setup
### Requirements
- Docker
- Docker-compose

After installing Docker and Docker compose on your machine, you can run
any of the following commands to begin:
- `Make install`: Will install dependencies across entire project.
- `Make dev`: Run entire project in a development environment. This will
probably take quite a while for Docker images to build. Then navigate to
`localhost:8080`.
- `Make prod`: Run entire project in production environment. Currently, the
main difference from the development environment is that frontend will
not be using Webpack HMR middleware and instead serving compiled JavaScript.

## Notes
This is very much a work in progress and will be changing frequently.

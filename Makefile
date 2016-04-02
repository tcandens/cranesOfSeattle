API_DIR = ./api
WEB_DIR = ./web

# Install dependencies across project
install:
	@ cd ${API_DIR} && npm install && cd .. && \
	cd ${WEB_DIR} && npm install

# Start containers with docker compose for development environment
dev:
	@ docker-compose build && \
	docker-compose up

# Start containers for productions environment
prod:
	@ docker-compose -f docker-compose-production.yml build && \
	docker-compose -f docker-compose-production.yml up

.PHONY: install dev prod

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

browser-sync:
	@ ${WEB_DIR}/node_modules/.bin/browser-sync start \
		--no-open \
		--proxy 'localhost:8080' \
		--files 'web/src'

# Start containers with testing environment
ci-build:
	@ docker-compose -f docker-compose.test-ci.yml build
ci:
	@ docker-compose -f docker-compose.test-ci.yml run test-api && \
	docker-compose -f docker-compose.test-ci.yml run test-web

test-api:
	@ docker-compose -f docker-compose.test.yml run --rm test-api

test-api-watch:
	@ docker-compose -f docker-compose.test.yml run --rm -e WATCH=TRUE test-api

test-web:
	@ docker-compose -f docker-compose.test.yml run --rm test-web

test-web-watch:
	@ docker-compose -f docker-compose.test.yml run --rm test-web npm run test:watch

# Start containers for productions environment
prod:
	@ docker-compose -f docker-compose.prod.yml build && \
	docker-compose -f docker-compose.prod.yml up

# Get SSL/HTTPS Certificates via Let's Encrypt
https:
	@./ssl/get_certs.sh

.PHONY: install dev browser-sync ci-build ci test-api test-api-watch \
	test-web test-web-watch prod https

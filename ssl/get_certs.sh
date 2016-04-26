#!/bin/sh

docker pull quay.io/letsencrypt/letsencrypt

docker run -it --rm --name letsencrypt-get-certs \
  -v "/etc/letsencrypt:/etc/letsencrypt" \
  -v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
  -p "80:80" \
  -p "443:443" \
  quay.io/letsencrypt/letsencrypt \
  certonly \
  --standalone \
  --agree-tos \
  -d www.seattlecranes.site
  -d seattlecranes.site
  -m joey.thies@gmail.com

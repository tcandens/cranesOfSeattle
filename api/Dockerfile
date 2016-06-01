FROM node:5.3

WORKDIR /var/www/api/
COPY ./node_modules node_modules/
COPY ./package.json package.json
COPY ./entry.sh entry.sh
COPY ./src src/
COPY ./migrations migrations/

EXPOSE 3000

CMD ["./entry.sh"]

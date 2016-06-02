FROM node:5.3

WORKDIR /var/www/api/
COPY ./node_modules node_modules/
COPY ./package.json package.json
COPY ./entry.sh entry.sh
COPY ./src src/
COPY ./migrations migrations/
COPY ./.babelrc .babelrc
COPY ./wait-for-it.sh wait-for-it.sh

EXPOSE 3000

CMD ["./entry.sh"]

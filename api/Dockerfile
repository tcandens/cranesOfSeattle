FROM node:5.3

WORKDIR /var/www/api/
COPY ./package.json package.json
RUN npm install
COPY ./entry.sh entry.sh
COPY . ./

EXPOSE 3000

CMD ["./entry.sh"]


FROM node:5.3

WORKDIR /var/www/api/
COPY ./package.json package.json
RUN npm install
COPY ./entry.sh entry.sh
COPY . ./

RUN apt-get update && apt-get install -y \
  netcat

EXPOSE 3000

CMD ["./entry.sh"]

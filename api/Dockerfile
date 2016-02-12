FROM node:5.3

# Install netcat for port listening between containers
RUN apt-get update && apt-get install -y \
  netcat

WORKDIR /var/www/api/
# For development, avoid npm install
# and favor mounting node_modules from host
# RUN npm install
COPY ./node_modules node_modules/
COPY ./package.json package.json
COPY ./entry.sh entry.sh
COPY . ./

EXPOSE 3000

CMD ["./entry.sh"]

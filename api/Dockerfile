FROM node:5.3

COPY ./package.json /var/www/api/
COPY ./entry.sh /var/www/api/
COPY ./src/ /var/www/api/src/
WORKDIR /var/www/api/
RUN npm install

EXPOSE 3000

CMD ["/var/www/api/entry.sh"]


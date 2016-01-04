FROM node:5.3

WORKDIR /usr/src/
COPY ./package.json package.json
RUN npm install
COPY . /usr/src/

EXPOSE 9000

CMD ["npm", "start"]

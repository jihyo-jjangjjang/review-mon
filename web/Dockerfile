FROM node:14-alpine
WORKDIR /code
COPY ./package.json /code/package.json
RUN npm install
COPY ./ /code/
CMD ["npm", "run", "start"]

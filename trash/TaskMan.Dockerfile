FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN yarn install
COPY ./src/ /usr/src/app/src
COPY prebuild.sh /usr/src/app
COPY postBuild.sh /usr/src/app


RUN yarn build

RUN cp ./dist/prebuild/TaskManBackEnd.mjs /usr/src/app/TaskManBackEnd.mjs
RUN cp ./dist/prebuild/TaskManFrontEnd.js /usr/src/app/TaskManFrontEnd.mjs
RUN cp ./dist/prebuild/TaskManFrontEnd.css /usr/src/app/TaskManFrontEnd.css

# RUN ts-node-esm ./node_modules/testeranto/dist/prebuild/TaskManBackEnd.mjs

EXPOSE 3000
EXPOSE 27017
ENV MONGO_HOST=host.docker.internal
# CMD ['yarn', 'testeranto-testrun', '&', 'yarn', 'testeranto-taskman']
CMD ["node", "./TaskManBackEnd.mjs"]
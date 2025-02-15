FROM node:18.18.0
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ && \
    rm -rf /var/lib/apt/lists/*
# FROM shivjm/node-chromium:node18-chromium81-alpine



RUN yarn global add node-gyp

RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/docs
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN yarn install
COPY ./src/ /usr/src/app/src
COPY ./subPackages/ /usr/src/app/subPackages
COPY ./testeranto.mts /usr/src/app/testeranto.mts
COPY ./tsconfig.json /usr/src/app/tsconfig.json
COPY ./init.mts /usr/src/app/init.mts
COPY ./bundle.mts /usr/src/app/bundle.mts
COPY ./test.mts /usr/src/app/test.mts

RUN yarn run init

RUN apt-get update && apt-get install -y chromium
RUN /usr/bin/chromium --no-sandbox --version > /etc/chromium-version

ENV CHROMIUM_PATH=/usr/bin/chromium
RUN yarn bundle
# COPY ./docs/ /usr/src/app/docs
# # COPY ./testeranto.json /usr/src/app/testeranto.json
# # COPY prebuild.sh /usr/src/app
# # COPY postBuild.sh /usr/src/app


# # RUN yarn build

# RUN cp ./node_modules/testeranto/dist/prebuild/TaskManBackEnd.mjs /usr/src/app/TaskManBackEnd.mjs
# RUN cp ./node_modules/testeranto/dist/prebuild/TaskManFrontEnd.js /usr/src/app/TaskManFrontEnd.js
# RUN cp ./node_modules/testeranto/dist/prebuild/TaskManFrontEnd.css /usr/src/app/TaskManFrontEnd.css

# # RUN ts-node-esm ./node_modules/testeranto/dist/prebuild/TaskManBackEnd.mjs

# EXPOSE 3000
# EXPOSE 27017
# ENV MONGO_HOST=host.docker.internal
# # # CMD ['yarn', 'testeranto-testrun', '&', 'yarn', 'testeranto-taskman']
CMD ["yarn", "test"]
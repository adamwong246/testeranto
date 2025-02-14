FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN yarn install
COPY . /usr/src/app

# RUN yarn testeranto-esbuild

# EXPOSE 3000
# CMD ['yarn', 'testeranto-testrun', '&', 'yarn', 'testeranto-taskman']
CMD ['yarn', 'testeranto-taskman']
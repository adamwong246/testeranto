#!/usr/bin/env sh

echo "testeranto build..."

yarn nodemon --config nodemon.json ./node_modules/testeranto/src/build.js ../../../testeranto.config.json
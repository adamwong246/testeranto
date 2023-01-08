#!/usr/bin/env sh

# yarn nodemon --config nodemon.json ./node_modules/testeranto/src/build.ts testeranto.config.json
cp ./node_modules/testeranto/dist/reporter.css ./dist/reporter.css
cp ./node_modules/testeranto/dist/reporter.js ./dist/reporter.js
cp ./node_modules/testeranto/dist/reporter.html ./dist/reporter.html
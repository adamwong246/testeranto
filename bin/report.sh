#!/usr/bin/env sh

# yarn nodemon --config nodemon.json ./node_modules/testeranto/src/build.ts testeranto.config.json
cp ./node_modules/testeranto/dist/report.css ./dist/report.css
cp ./node_modules/testeranto/dist/report.js ./dist/report.js
cp ./node_modules/testeranto/dist/report.html ./dist/report.html
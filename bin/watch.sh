#!/usr/bin/env sh

echo "testeranto watch..."

yarn ts-node --transpile-only ./node_modules/testeranto/src/watch.ts testeranto.config.json
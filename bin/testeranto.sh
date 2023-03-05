#!/usr/bin/env sh

yarn tsc --watch --module esnext --esModuleInterop --target esnext --moduleResolution node --outdir js  \
& node --watch $1

# yarn tsc $1
# # yarn esbuild $1 \
# --watch \
# # --bundle \
# # "--packages=external" \
# "--outfile=dist/config.js" \
# & nodemon ./dist/js/config.js

# node ./node_modules/testeranto/src/testeranto.mjs $1
#!/usr/bin/env sh

yarn tsc --module esnext --esModuleInterop --target esnext --moduleResolution node --outdir js; node $1

#!/usr/bin/env sh

yarn tsc --watch --module esnext --esModuleInterop --target esnext --moduleResolution node --outdir js  & node --watch $1

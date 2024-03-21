#!/usr/bin/env sh
# 
# testerantoRun <outdir> <config_file>
# example: 
# testerantoRun js testeranto.test.mjs

yarn tsc --module esnext --esModuleInterop --target esnext --moduleResolution node --outdir $1; node $1/$2
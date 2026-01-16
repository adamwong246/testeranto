Each builder is a docker image that does 3 things
1) imports a config file in the respective languuage
2) creates bundles
  - node - esbuild
  - web - esbuild
  - python - shv ar zipapp
  - golang - TBD
3) creates the inputFiles.json file
  - a list of all the files that were used to create the bundle

# golang builder

This will run in a builder container for golang projects. It has 2 jobs

1) build the golang tests
2) produce a "metafile" - a json file describing the output files and for each, the input files. This should be similar to the js's esbuild metafile. 
3) act as a host for BDD tests and static analysis tests.

BDD tests and static analysis tests are run as Docker commands upon the build image. These will be run from outside the builder (in the server). The builder only needs to be setup to run these tests- it does not run these tests itself. 

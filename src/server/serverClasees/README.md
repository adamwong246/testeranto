The Server is a process run outside Docker. It's job is to docker-compose files and manage docker containers as procesess

Each docker-compose files is built with several images

these will always be present. Their job is to continuously create metafiles and bundles of tests

- builder-node
- builder-web
- builder-golang
- builder-python

For all 4 runtimes and for each test, there will be 2 more images to execute

these are based on the tests runtime

- zero or more static analysis
- BDD test 

As the builder services produce bundles and set of input files, the server watches for those changes. When a bundle changes, a static analysis and BDD test should be scheduled. =

Upon startup, the server should also create an aider process for each runtime and test. The will run an aider process for each test. it's context should be loaded with the results of the static analysis and BDD test results, as well as all the input files for that test pulled from the metafile.

# processes
The Process Manager models processes as docker containers. "Process" in this context refers to a running docker contianer, not a host machine process.

The Process manager needs to account for docker container "processes" of the following "shape"

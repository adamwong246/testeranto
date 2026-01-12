The Server is a process run outside Docker. It's job is to generate the docker and docker-compose files, manage docker containers as procesess, watching for changes to metafiles, and queing/dequeueing now process/docker-images.

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

The server should use this to create the appropriate docker-compose and docker files.

As the builder services produce bundles into a volume, the server watches for those changes. When a bundle changes, a static analysis and BDD test should be scheduled. These 2 "jobs" should be queued/dequeued by the server as docker images. The static analysis is defined on the config 'allTests.ts'

Upon startup, the server should also create an aider process for each runtime and test. The will run an aider process for each test. it's context should be loaded with the results of the static analysis and BDD test results, as well as all the input files for that test pulled from the metafile.

Each image/process should be associated with a websocket connection to a test, either BDD or Static analysis.

1. server startup
2. create docker files
3. start the builder services
4. watch for metafile changes
5. schedule bdd and static analysis test/process/image(s).

- as each test comes online with a set of "test resource configurations". For BDD tests, this contains 1 or more ports (plus some more info). For static analysis, this payload should contains a list of files derived from the metafile. These files should be the input files for a test.
  - as each BDD test completes, it passes it's results back over websocket (this is to accamodate webtests which cannot write files directly)
  - for each static analysis, we can write files directly to the reports folder via the volume

# processes

The Process manager needs to account for processes of the following "shape"

- The System process
- The BDD process for each test. id: `allTests-${runtime}-${pathToTest}-bdd`
- The Static Test processes for each test. id: `allTests-${runtime}-${pathToTest}-${N}`
- The aider process for each test. id: `allTests-${runtime}-${pathToTest}-aider`
- The builder process for each runtime. id `allTests-${runtime}-${pathToTest}-builder`

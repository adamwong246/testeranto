# Testeranto src

## runtimes

there are 3- web, node and pure

## metafile

The metafile is extra data emitted by the bundling process. Through it, the src files of a test can be ascertained. There is 1 metafile for each of the runtimes

## features reporter

The report app is capable of showing the features and documentation "collated" into a single place. This is a feature of the React app and has its own route. The `FeaturesReporter` component gathers all the features from all `tests.json` files across all projects, along with the status of individual tests and larger jobs. Maintaining the original file structures, it displays all these features and statuses in a single view, providing a comprehensive overview of the testing landscape. This view takes the list of tests and using the file structures, shows each test as an entry in a tree matching the source code directories.

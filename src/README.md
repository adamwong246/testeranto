# Testeranto src

## runtimes

there are 3 runtimes- web, node and pure.

### web

- runs via node spawn on v8.
- for test subjects which use native packages. (fs, crypto)
- automatically produces creates logs:
  -- stdout.log
  -- stderr.log

### browser

- runs via chrome via puppeteer.
- for test subjects which use client globals (window, document)
- automatically produces creates logs:
  -- error.log
  -- warn.log
  -- info.log
  -- debug.log

### pure

- runs in the main process via dynamic import
- for test subjects which use no platform specific features.

## metafile

The metafile is extra data emitted by the bundling process. Through it, the src files of a test can be ascertained. There is 1 metafile for each of the runtimes

## features reporter

The report app is capable of showing the features and documentation "collated" into a single place. This is a feature of the React app and has its own route. The `FeaturesReporter` component gathers all the features from all `tests.json` files across all projects, along with the status of individual tests and larger jobs. Maintaining the original file structures, it displays all these features and statuses in a single view, providing a comprehensive overview of the testing landscape. This view takes the list of tests and using the file structures, shows each test as an entry in a tree matching the source code directories.

## Core Testing Principles

1. Tests follow BDD structure with Given/When/Then
2. All tests are strongly typed using I/O/M types
3. Test files are organized in a consistent structure:
   /src
   TEST_SUBJECT.ts
   TEST_SUBJECT.test/
   implementation.ts - Concrete test operations
   specification.ts - Test scenarios and assertions  
    adapter.ts - Test lifecycle hooks
   types.ts - Type definitions
   index.ts - Main test export
4. If the test subject is an abstract class, implement this simplest possible mock, and test that mock.

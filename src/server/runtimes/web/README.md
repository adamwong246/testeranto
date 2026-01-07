The web runtime refers to a testeranto test that should be run in google chrome.

The builder service should create metafiles and host a chrome instance with debug connection.

The server detects these changes and schedules the test to run. This test is run as a docker-image/process. In the case of the web runtime, the server builds upon the web builder image, executing a command that will open a chrome tab to a url with query param. It is important to note that the test process should NOT create a new chrome instance, it should only invoke the chrome instance running of the web builder service.

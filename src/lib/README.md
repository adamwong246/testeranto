These are the three BDD libs

- tiposkirpito (web and node runtimes)
- golingvu (golang)
- pitono (python)
- rubeno (ruby)

Each is an implementation of a Testeranto test. Each test should come online with a "test resource configuration" as a command line paramter (in the case of node, python and pitono). For webtests, this should be passed as a query paramter. As each test completes, it should transmit it results back to the server via websockets (this is to acomodate web tests which cannot write to fs directly.)

TODO

- the tests have an broken pattern. They come online, request the test resource config, pass it to recieveTestCongifugration to run the actual tests.
- We need this to follow the new pattern wherin the test is passed the test resource config directly, rather than requesting it after it's come online
- remove all references to Analyzer. It is deprecated. This will now be done elsewhere.

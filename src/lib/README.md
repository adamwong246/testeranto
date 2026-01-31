These are the 6 BDD libs

- tiposkirpito (web and node runtimes)
- golingvu (golang)
- pitono (python)
- rubeno (ruby)
- kafe (java)
- rusto (rust)

Each is an implementation of a Testeranto test. Each test should come online with a "test resource configuration" as a command line paramter (in the case of node, python and pitono). For webtests, this should be passed as a query paramter. As each test completes, it should transmit it results back to the server via websockets (this is to acomodate web tests which cannot write to fs directly.)

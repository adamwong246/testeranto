Each of the 4 runtime builders contain an entrypoint file.

<!-- TODO -->

Each builder needs to send to the Server via WS a message "sourceFilesUpdated" with payload of all the input files for that test.  This will inform the server that the for a given test, PERHAPS at least one of it's input files has changed. this message is is sent when any of the input files for a test file has changed. This should be computed using a lanaguage specific tool (esbuild for node and web, 'go list' for golang, etc). After gathering the list of input files, for each the hash of that file is computed. All the input file hashes are added togethter, and another hash of ALL files is made. This super-hash, along with the list of files, is sent via "sourceFilesUpdated"
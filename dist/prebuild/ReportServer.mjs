import { createRequire } from 'module';const require = createRequire(import.meta.url);

// src/ReportServer.ts
import staticServer from "node-static";
import http from "http";
var main = async () => {
  const fileServer = new staticServer.Server("./testeranto", {});
  http.createServer(function(request, response) {
    request.addListener("end", function() {
      fileServer.serve(request, response);
    }).resume();
  }).listen(8080);
  console.log("Server running on port 8080");
};
main();

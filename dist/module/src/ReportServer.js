// simple http server to preview reports
import staticServer from "node-static";
import http from "http";
const main = async () => {
    const fileServer = new staticServer.Server("./", { cache: false });
    http
        .createServer(function (request, response) {
        request
            .addListener("end", function () {
            fileServer.serve(request, response);
        })
            .resume();
    })
        .listen(8080);
    console.log("Server running on port 8080");
};
main();

import staticServer from "node-static";
import http from "http";
const main = async () => {
    process.chdir("../"); // Navigate one level up
    const fileServer = new staticServer.Server(".", {});
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

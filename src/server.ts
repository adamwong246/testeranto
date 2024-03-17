import http from "http";

console.log("hello server");

export const serverFactory = () => {
  console.log("hello serverFactory");
  let status = "some great status";
  let counter = 0;

  const server = http.createServer(function (req, res) {

    // req.
    // req.on("error", function () {
    //   console.log("ERROR!")
    // });

    if (req.method === "GET") {
      console.log("GET");
      if (req.url === "/get_status") {
        res.write(status);
        res.end();
        return;
      } else if (req.url === "/get_number") {
        console.log("mark0");
        console.log(counter);
        res.write(counter.toString());
        res.end();
        return;
      } else {
        res.write("<p>error 404<p>");
        res.end();
        return;
      }

      // res.writeHead(200, { "Content-Type": "text/text" });
      // res.end();
    } else if (req.method === "POST") {
      console.log("POST");
      let body = "";
      req.on("data", function (chunk) {
        body += chunk;
      });

      req.on("end", function () {
        if (req.url === "/put_status") {
          status = body.toString();
          res.write("aok");
          res.end();
          return;
        } else if (req.url === "/put_number") {
          counter = counter + parseInt(body);
          res.write(counter.toString());
          res.end();
          return;
        } else {
          res.write("<p>error 404<p>");
          res.end();
          return;
        }

        // res.writeHead(200, { "Content-Type": "text/html" });
        // res.end(body);
      });




    }
  });

  return server;
};

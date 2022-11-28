import http from "http";

export const serverFactory = () => {
  let status = "some great status";
  let counter = 0;

  return http.createServer(function (req, res) {
    if (req.method === "GET") {
      if (req.url === "/get_status") {
        res.write(status);
        res.end();
        return;
      } else if (req.url === "/get_number") {
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
      var body = "";
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
};

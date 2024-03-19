import http from "http";

const htmlTemplate = (jsbundle: string): string => `
<!DOCTYPE html><html lang="en">
  <head>
    <script type="module" src="./ClassicalComponent">
      ${jsbundle}
    </script>
    <script type="module">
      import { LaunchClassicalComponent } from "ClassicalComponent";
      LaunchClassicalComponent();
    </script>
  </head>

  <body>
    <h2>hello esbuild-puppeteer.testeranto</h2>
    <div id="root">
    </div>
  </body>

  <footer></footer>
</html>`;

export const serverFactory = () => {
  let status = "some great status";
  let counter = 0;

  const server = http.createServer(function (req, res) {

    if (req.method === "GET") {
      if (req.url === "/get_status") {
        res.write(status);
        res.end();
        return;
      } else if (req.url === "/get_number") {
        res.write(counter.toString());
        res.end();
        return;
      } else if (req.url === "/classical_component") {
        res.write(htmlTemplate('ClassicalComponent.js'));
        res.end();
        return;
      }
      else if (req.url === "/login_page") {
        res.write(htmlTemplate('LoginPage.js'));
        res.end();
        return;
      } else {
        res.write("<p>error 404<p>");
        res.end();
        return;
      }

    } else if (req.method === "POST") {
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

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestPageHtml = exports.ProjectPageHtml = exports.ProjectsPageHtml = void 0;
const getBaseHtml = (title) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta name="description" content="Webpage description goes here" />
  <meta charset="utf-8" />
  <title>${title} - testeranto</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="author" content="" />

  <script>
    var base = document.createElement('base');
    var l = window.location;

    if (l.hostname === "localhost") {
      base.href = l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') + '/';
    } else if (l.hostname === "adamwong246.github.io") {
      base.href = "https://adamwong246.github.io/testeranto/";
    } else {
      console.error("unsupported hostname");
    }
    document.getElementsByTagName('head')[0].appendChild(base);
  </script>
`;
const ProjectsPageHtml = () => `
  ${getBaseHtml("Projects - Testeranto")}
  
  <link rel="stylesheet" href="testeranto/ReportApp.css" />
  <script src="testeranto/ProjectsPage.js"></script>
</head>
<body>
  <div id="root"></div>
  <div style="position: fixed; bottom: 10px; right: 10px;">
    made with ❤️ and <a href="https://www.npmjs.com/package/testeranto">testeranto</a>
  </div>
</body>
</html>
`;
exports.ProjectsPageHtml = ProjectsPageHtml;
const ProjectPageHtml = (projectName) => `
  ${getBaseHtml(`${projectName} - Testeranto`)}
  
  <link rel="stylesheet" href="/testeranto/ReportApp.css" />
  <script src="/testeranto/ProjectPage.js"></script>
</head>
<body>
  <div id="root"></div>
  <div style="position: fixed; bottom: 10px; right: 10px;">
    made with ❤️ and <a href="https://www.npmjs.com/package/testeranto">testeranto</a>
  </div>
</body>
</html>
`;
exports.ProjectPageHtml = ProjectPageHtml;
const TestPageHtml = (testName) => `
  ${getBaseHtml(`${testName} - Testeranto`)}
  
  <link rel="stylesheet" href="testeranto/ReportApp.css" />
  <script src="testeranto/TestPage.js"></script>
</head>
<body>
  <div id="root"></div>
  <div style="position: fixed; bottom: 10px; right: 10px;">
    made with ❤️ and <a href="https://www.npmjs.com/package/testeranto">testeranto</a>
  </div>
</body>
</html>
`;
exports.TestPageHtml = TestPageHtml;

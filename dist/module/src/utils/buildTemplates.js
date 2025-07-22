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
      base.href = l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') + '/testeranto/';
    } else if (l.hostname === "adamwong246.github.io") {
      base.href = "https://adamwong246.github.io/testeranto/";
    } else {
      console.error("unsupported hostname");
    }
    document.getElementsByTagName('head')[0].appendChild(base);
  </script>
`;
// <link rel="stylesheet" href="/testeranto/static/css/bootstrap.min.css" />
//   <script src="/testeranto/static/js/react.production.min.js"></script>
//   <script src="/testeranto/static/js/react-dom.production.min.js"></script>
//   <script src="/testeranto/static/js/react-router-dom.min.js"></script>
//   < script src = "/testeranto/static/js/bootstrap.bundle.min.js" > </script>
export const AppHtml = (title = "Testeranto") => `
  ${getBaseHtml(title)}
  
  <link rel="stylesheet" href="/testeranto/ReportApp.css" />
  <script src="/testeranto/ReportApp.js"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>
`;
export const ProjectsPageHtml = () => `
  ${getBaseHtml("Projects - Testeranto")}
  
  <link rel="stylesheet" href="testeranto/ReportApp.css" />
  <script src="testeranto/ProjectsPage.js"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>
`;
export const ProjectPageHtml = (projectName) => `
  ${getBaseHtml(`${projectName} - Testeranto`)}
  
  <link rel="stylesheet" href="/testeranto/ReportApp.css" />
  <script src="/testeranto/ProjectPage.js"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>
`;
export const TestPageHtml = (testName) => `
  ${getBaseHtml(`${testName} - Testeranto`)}
  
  <link rel="stylesheet" href="/testeranto/ReportApp.css" />
  <script src="/testeranto/TestPage.js"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>
`;

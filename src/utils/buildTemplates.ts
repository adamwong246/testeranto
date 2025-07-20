const getBaseHtml = (title: string) => `
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
      base.href = "https://adamwong246.github.io/testeranto/testeranto/";
    } else {
      console.error("unsupported hostname");
    }
    document.getElementsByTagName('head')[0].appendChild(base);
  </script>
`;

export const ProjectPageHtml = (packageName: string, projects: unknown) => `
  ${getBaseHtml(packageName)}
  <script type="application/json" id="bigConfig">
    ${JSON.stringify(Object.keys(projects))}
  </script>
  <link rel="stylesheet" href="Project.css" />
  <script type="module" src="Project.js"></script>
</head>
<body>
  <div id="root">
    react is loading
  </div>
</body>
</html>
`;

export const TestPageHtml = (testName: string) => `
  ${getBaseHtml(testName)}
  <link rel="stylesheet" href="TestReport.css" />
  <script src="TestReport.js"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>
`;

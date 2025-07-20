export const testReportPage = (packageName, domain) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
  
    <head>
      <meta name="description" content="Webpage description goes here" />
      <meta charset="utf-8" />
      <title>${packageName} - testeranto</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="author" content="" />
      
      (function () {
    window.__getLocation = function () {
        return window.location;
    };
    window.dynamicBase = function (suffix) {
        var base = document.createElement('base');
        var l = window.__getLocation();

        if (l.hostname === "localhost){
          base.href = l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') + (suffix || '');
        } else if (l.hostname === "adamwong246.github.io"){
          base.href = "https://adamwong246.github.io/testeranto";
        } else {
          console.error("unsupported hostname");
        }
        
        document.getElementsByTagName('head')[0].appendChild(base);
    };
})();

      </script>

  
      <link rel="stylesheet" href="../ReportClient.css" />
      <script type="module" src="../ReportClient.js"></script>
  
    </head>
  
    <body>
      <div id="root">
        react is loading
      </div>
    </body>
  
    </html>
        `;
};
export const testsReportPage = (packageName, domain, projects) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
  
    <head>
      <meta name="description" content="Webpage description goes here" />
      <meta charset="utf-8" />
      <title>${packageName} - testeranto</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="author" content="" />
      

      <script>
      

      (function () {
    window.__getLocation = function () {
        return window.location;
    };
    window.dynamicBase = function (suffix) {
        var base = document.createElement('base');
        var l = window.__getLocation();

        if (l.hostname === "localhost){
          base.href = l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') + (suffix || '');
        } else if (l.hostname === "adamwong246.github.io"){
          base.href = "https://adamwong246.github.io/testeranto";
        } else {
          console.error("unsupported hostname");
        }
        
        document.getElementsByTagName('head')[0].appendChild(base);
    };
})();

      </script>
      
      <script>window.dynamicBase("/testeranto")</script>

  
      <script type="application/json" id="bigConfig">
        ${JSON.stringify(Object.keys(projects))}
      </script>
  
      <link rel="stylesheet" href="/testeranto/Project.css" />
      
      <script type="module" src="/testeranto/Project.js"></script>
  
    </head>
  
    <body>
      <div class="parallax-background"></div>
      <div id="root">
        react is loading
      </div>
    </body>
  
    </html>
        `;
};
// deprecated?
export const idkPage = (testName, domain) => {
    return `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta name="description" content="Webpage description goes here" />

  <meta charset="utf-8" />
  <title>${testName} - testeranto</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="author" content="" />

  <link rel="stylesheet" href="/TestReport.css" />
  <script src="/TestReport.js"></script>

        <script>
      

      (function () {
    window.__getLocation = function () {
        return window.location;
    };
    window.dynamicBase = function (suffix) {
        var base = document.createElement('base');
        var l = window.__getLocation();
        base.href = l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') + (suffix || '');
        document.getElementsByTagName('head')[0].appendChild(base);
    };
})();

      </script>

      <script>window.dynamicBase("/testeranto")</script>


</head>

<body>

  <div id="root"/>
</body>
            `;
};

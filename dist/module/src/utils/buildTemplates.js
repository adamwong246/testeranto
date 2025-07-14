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
      
      <base href="${domain}" target="_blank">
  
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
      <base href="${domain}" target="_blank">
  
      <script type="application/json" id="bigConfig">
        ${JSON.stringify(Object.keys(projects))}
      </script>
  
      <link rel="stylesheet" href="./testeranto/Project.css" />
      <script type="module" src="./testeranto/Project.js"></script>
  
    </head>
  
    <body>
      <div id="root">
        react is loading
      </div>
    </body>
  
    </html>
        `;
};
export const idkPage = (testName, domain) => {
    return `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta name="description" content="Webpage description goes here" />
  <base href="${domain}" target="_blank">
  <meta charset="utf-8" />
  <title>${testName} - testeranto</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="author" content="" />

  <link rel="stylesheet" href="./testeranto/TestReport.css" />
  <script src="./testeranto/TestReport.js"></script>

</head>

<body>
  <div id="root"/>
</body>
            `;
};

export default () => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta name="description" content="Webpage description goes here" />
  <meta charset="utf-8" />
  <title>kokomoBay - testeranto</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="author" content="" />

  <link rel="stylesheet" href="./Report.css">

  <script type="importmap">
    {
    "imports": {
      "features.test.js": "./features.test.js",
      "testeranto.json": "./testeranto.json"
    }
  }
  </script>

  <script type="module" src="./Report.js"></script>
</head>

<body><div id="root">react is loading</div></body>

</html>
`;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta name="description" content="Webpage description goes here" />
  <meta charset="utf-8" />
  <title>kokomoBay - testeranto</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="author" content="" />
  <link rel="stylesheet" href="./Report.css" />
  <script src="./Report.js"></script>

  <script type="importmap">
    {
    "imports": {
      "testeranto.json": "../testeranto.json",
      "features.test.js": "./features.test.js"
    }
  }
  </script>
</head>

<body><div id="root">react is loading</div></body>

</html>
`;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (jsfilePath, htmlFilePath) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <script type="module" src="${jsfilePath}"></script>
</head>

<body>
  <h1>${htmlFilePath}</h1>
  <div id="root">

  </div>
</body>

<footer></footer>

</html>
`;

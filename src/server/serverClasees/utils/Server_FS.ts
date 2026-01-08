const getBaseHtml = (title: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta name="description" content="Webpage description goes here" />
  <meta charset="utf-8" />
  <title>${title} - testeranto</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="author" content="" />


`;

export const ProcessMangerHtml = () => `
  ${getBaseHtml("Testeranto")}
  
  <link rel="stylesheet" href="ProcessManger.css" />
  <script src="ProcessManger.js"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>
`;

export const IndexHtml = () => `
  ${getBaseHtml("Testeranto")}
  
  <link rel="stylesheet" href="Index.css" />
  <script src="Index.js"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>
`;

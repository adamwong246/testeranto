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
    function initApp() {
      if (window.React && window.ReactDOM && window.App) {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(App));
      } else {
        setTimeout(initApp, 100);
      }
    }
    window.addEventListener('DOMContentLoaded', initApp);
  </script>
`;

export const AppHtml = () => `
  ${getBaseHtml("Testeranto")}
  
  <link rel="stylesheet" href="App.css" />
  <script src="App.js"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>
`;

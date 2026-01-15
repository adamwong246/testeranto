// Utility function to generate HTML for React apps
export function generateReactAppHtml(
  title: string,
  scriptPath: string,
  appName: string
): string {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="/dist/prebuild/style.css" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script src="/dist/prebuild/server/serverClasees/${scriptPath}.js"></script>
    <script>
      // The bundled script automatically calls initApp when loaded
      // Ensure the root element exists
      if (!document.getElementById('root').innerHTML) {
        document.getElementById('root').innerHTML = '<div class="text-center mt-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2">Loading ${appName}...</p></div>';
      }
    </script>
  </body>
</html>
  `.trim();
}

// Generate HTML for redirect
export function generateRedirectHtml(
  redirectUrl: string,
  message: string
): string {
  return `
<!DOCTYPE html>
<html>
  <head>
    <title>Redirecting</title>
    <meta http-equiv="refresh" content="0; url=${redirectUrl}" />
  </head>
  <body>
    <p>${message} <a href="${redirectUrl}">here</a>...</p>
  </body>
</html>
  `.trim();
}

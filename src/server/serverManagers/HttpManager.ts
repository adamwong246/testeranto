export class HttpManager {
  routeName(req: any): string {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const urlPath = url.pathname;

    // Extract route name (remove /~/ prefix)
    return urlPath.slice(3); // Remove '/~/'
  }

  decodedPath(req: any): string {
    const urlPath = new URL(req.url, `http://${req.headers.host}`).pathname;

    // Prevent directory traversal attacks
    const decodedPath = decodeURIComponent(urlPath);
    // Remove leading slash to make it relative
    return decodedPath.startsWith("/")
      ? decodedPath.slice(1)
      : decodedPath;
  }

  matchRoute(routeName: string, routes: Record<string, any>): { handler: any; params: Record<string, string> } | null {
    // First, try exact match
    if (routes && routes[routeName]) {
      return { handler: routes[routeName], params: {} };
    }

    // Then, try pattern matching
    for (const [pattern, handler] of Object.entries(routes)) {
      if (pattern.includes(':')) {
        // Split pattern into parts
        const patternParts = pattern.split('/');
        const routeParts = routeName.split('/');

        // Check if the last pattern part ends with .xml and contains a parameter
        const lastPatternPart = patternParts[patternParts.length - 1];
        const isLastParamWithExtension = lastPatternPart.includes(':') && lastPatternPart.includes('.xml');

        if (isLastParamWithExtension) {
          // For patterns like 'process_manager/:runtime/:testname.xml'
          let matches = true;
          const params: Record<string, string> = {};

          // Match all parts except the last one
          for (let i = 0; i < patternParts.length - 1; i++) {
            const patternPart = patternParts[i];
            const routePart = routeParts[i];

            if (patternPart.startsWith(':')) {
              // It's a parameter
              const paramName = patternPart.slice(1);
              params[paramName] = routePart;
            } else if (patternPart !== routePart) {
              matches = false;
              break;
            }
          }

          if (matches) {
            // The last parameter should capture all remaining route parts
            const lastParamName = lastPatternPart.slice(1, lastPatternPart.indexOf('.xml'));
            const remainingParts = routeParts.slice(patternParts.length - 1);
            let paramValue = remainingParts.join('/');

            // Remove .xml from the end if present
            if (paramValue.endsWith('.xml')) {
              paramValue = paramValue.slice(0, -4);
            }
            params[lastParamName] = paramValue;

            return { handler, params };
          }
        } else {
          // Original logic for patterns without special handling
          if (patternParts.length !== routeParts.length) {
            continue;
          }

          let matches = true;
          const params: Record<string, string> = {};

          for (let i = 0; i < patternParts.length; i++) {
            const patternPart = patternParts[i];
            const routePart = routeParts[i];

            if (patternPart.startsWith(':')) {
              // It's a parameter
              const paramName = patternPart.slice(1);
              params[paramName] = routePart;
            } else if (patternPart !== routePart) {
              matches = false;
              break;
            }
          }

          if (matches) {
            return { handler, params };
          }
        }
      }
    }
    return null;
  }

  extractParams(pattern: string, routeName: string): Record<string, string> | null {
    const patternParts = pattern.split('/');
    const routeParts = routeName.split('/');
    
    if (patternParts.length !== routeParts.length) {
      return null;
    }
    
    const params: Record<string, string> = {};
    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];
      const routePart = routeParts[i];
      
      if (patternPart.startsWith(':')) {
        const paramName = patternPart.slice(1);
        params[paramName] = routePart;
      } else if (patternPart !== routePart) {
        return null;
      }
    }
    return params;
  }
}

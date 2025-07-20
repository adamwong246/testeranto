# Console Detector Plugin

## Purpose

This esbuild plugin detects usage of `console.*` methods in code that will run under the Pure runtime. Since Pure runtime doesn't allow IO operations, these calls will fail silently. The plugin provides warnings during build time to alert developers.

## Why This Exists

1. **Pure Runtime Constraints**:

   - Pure runtime has no access to IO operations
   - Console methods are IO operations
   - Failed calls won't throw errors, just silently fail

2. **Developer Experience**:
   - Catches issues at build time rather than runtime
   - Clearly indicates which files/lines need attention
   - Guides developers to use Node runtime when IO is needed

## Usage

```javascript
import { consoleDetectorPlugin } from "./consoleDetectorPlugin";

// Add to your esbuild config
esbuild.build({
  plugins: [consoleDetectorPlugin],
  // ... other config
});
```

## Behavior

- Scans all .js and .ts files
- Detects any `console.*` method calls
- Generates warnings with file locations
- Doesn't fail the build (just warns)

## Recommendations

1. For Pure runtime code:

   - Remove all console.\* calls
   - Use alternative debugging methods

2. When you need console output:
   - Switch to Node runtime
   - Use the appropriate test adapter

## Implementation Notes

- Uses esbuild's onLoad hook
- Checks for 20+ different console methods
- Provides exact line numbers for warnings

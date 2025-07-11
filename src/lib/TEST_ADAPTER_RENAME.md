# Test Adapter Rename Proposal

## Current Problems
1. `interface` is:
   - Too vague/overloaded term
   - Conflicts with TypeScript keyword
   - Doesn't convey the wrapping/mediation purpose

## Proposed Solution
Rename to `TestAdapter` because:
- Standard pattern name in testing frameworks
- Precisely describes the wrapping/adaptation role
- Avoids language conflicts
- Matches industry terminology

## Required Changes
### File Renames:
- `testInterface.ts` → `testAdapter.ts`

### Type Changes:
- `ITestInterface` → `ITestAdapter`
- All related interface types

### Documentation Updates:
- Update all JSDoc references
- Update README examples

## Benefits
1. Clearer code intent
2. Better pattern alignment
3. Reduced naming collisions
4. More discoverable architecture

## Risks/Mitigations
1. Breaking change → Major version bump
2. Need to update all test files → Codemod script
3. Documentation updates → Batch update before release

## Implementation Plan
1. First create new types alongside old ones
2. Deprecate old names with warnings
3. Provide migration guide
4. Remove old names in next major version

## References
- [xUnit Test Patterns](http://xunitpatterns.com/)
- [VS Test Adapters](https://devblogs.microsoft.com/devops/how-to-write-a-visual-studio-test-adapter/)
- [JUnit TestEngine](https://junit.org/junit5/docs/current/user-guide/)

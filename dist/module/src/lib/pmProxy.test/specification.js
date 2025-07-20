export const specification = (Suite, Given, When, Then) => [
    Suite.Default("PM Proxy Functionality", {
        // Basic path rewriting tests
        writeFileProxyTest: Given.SomeBaseString(["butThenProxy should rewrite writeFileSync paths"], [], [
            Then.theButTheProxyReturns("writeFileSync", "test/path/butThen/test.txt"),
        ], "writeFileSync test"),
        createWriteStreamProxyTest: Given.SomeBaseString(["butThenProxy should rewrite createWriteStream paths"], [], [
            Then.theButTheProxyReturns("createWriteStream", "test/path/butThen/stream.txt"),
        ], "createWriteStream test"),
        screencastProxyTest: Given.SomeBaseString(["butThenProxy should rewrite screencast paths"], [], [
            Then.theButTheProxyReturns("screencast", "test/path/butThen/screen.png"),
        ], "screencast test"),
        customScreenShotProxyTest: Given.SomeBaseString(["butThenProxy should rewrite customScreenShot paths"], [], [
            Then.theButTheProxyReturns("customScreenShot", "test/path/butThen/shot.png"),
        ], "customScreenShot test"),
        // Edge cases
        emptyPathTest: Given.SomeBaseString(["butThenProxy should handle empty paths"], [], [Then.theButTheProxyReturns("writeFileSync", "test/path/butThen/")], "empty path test"),
        nestedPathTest: Given.SomeBaseString(["butThenProxy should handle nested paths"], [], [
            Then.theButTheProxyReturns("writeFileSync", "test/path/butThen/nested/folder/test.txt"),
        ], "nested path test"),
        specialCharsTest: Given.SomeBaseString(["butThenProxy should handle special characters in paths"], [], [
            Then.theButTheProxyReturns("writeFileSync", "test/path/butThen/file with spaces.txt"),
        ], "special chars test"),
    }),
    Suite.Default("Proxy Type Coverage", {
        // Test all proxy types
        butThenProxyTest: Given.SomeBaseString(["butThenProxy should work correctly"], [], [
            Then.theButTheProxyReturns("writeFileSync", "test/path/butThen/test.txt"),
        ], "butThenProxy test"),
        andWhenProxyTest: Given.SomeBaseString(["andWhenProxy should work correctly"], [], [
            Then.theButTheProxyReturns("writeFileSync", "test/path/andWhen/test.txt"),
        ], "andWhenProxy test"),
        beforeEachProxyTest: Given.SomeBaseString(["beforeEachProxy should work correctly"], [], [
            Then.theButTheProxyReturns("writeFileSync", "suite-1/beforeEach/test.txt"),
        ], "beforeEachProxy test"),
        afterEachProxyTest: Given.SomeBaseString(["afterEachProxy should work correctly"], [], [
            Then.theButTheProxyReturns("writeFileSync", "suite-1/given-1/afterEach/test.txt"),
        ], "afterEachProxy test"),
    }),
    Suite.Default("Content Preservation", {
        // Verify content is preserved
        contentPreservationTest: Given.SomeBaseString(["Proxies should preserve file content"], [], [
            Then.theButTheProxyReturns("writeFileSync", "test/path/butThen/test.txt"),
            Then.verifyContent("test content"),
        ], "content preservation test"),
        objectContentTest: Given.SomeBaseString(["Proxies should preserve object content"], [], [
            Then.theButTheProxyReturns("screencast", "test/path/butThen/screen.png"),
            Then.verifyContent({ quality: 80, fullPage: true }),
        ], "object content test"),
    }),
    Suite.Default("Error Cases", {
        invalidPathTest: Given.SomeBaseString(["Proxies should handle invalid paths"], [], [
            Then.theButTheProxyReturns("writeFileSync", "test/path/butThen/../invalid.txt"),
        ], "invalid path test"),
        undefinedInputTest: Given.SomeBaseString(["Proxies should handle undefined inputs"], [], [Then.theButTheProxyReturns("writeFileSync", undefined)], "undefined input test"),
    }),
];

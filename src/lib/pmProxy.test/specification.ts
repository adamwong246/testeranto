import { I, O } from "./types";
import { ITestSpecification } from "../../CoreTypes";

export const specification: ITestSpecification<I, O> = (
  Suite,
  Given,
  When,
  Then,
  Check
) => [
  Suite.Default(
    "PM Proxy Functionality",
    {
      writeFileProxyTest: Given.SomeBaseString(
        ["butThenProxy should rewrite writeFileSync paths"],
        [],
        [Then.theButTheProxyReturns("writeFileSync", "test/path/butThen/test.txt")],
        "a test string"
      ),
      createWriteStreamProxyTest: Given.SomeBaseString(
        ["butThenProxy should rewrite createWriteStream paths"],
        [],
        [Then.theButTheProxyReturns("createWriteStream", "test/path/butThen/stream.txt")],
        "a test string"
      ),
      screencastProxyTest: Given.SomeBaseString(
        ["butThenProxy should rewrite screencast paths"],
        [],
        [Then.theButTheProxyReturns("screencast", "test/path/butThen/screen.png")],
        "a test string"
      ),
      customScreenShotProxyTest: Given.SomeBaseString(
        ["butThenProxy should rewrite customScreenShot paths"],
        [],
        [Then.theButTheProxyReturns("customScreenShot", "test/path/butThen/shot.png")],
        "a test string"
      ),
    },
    []
  ),
];

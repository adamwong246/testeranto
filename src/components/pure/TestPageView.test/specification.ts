import { ITestSpecification } from "../../../CoreTypes";
import { ISelection, O } from "./types";

export const specification: ITestSpecification<
  {
    iinput: any;
    isubject: any;
    istore: ISelection;
    iselection: ISelection;
    given: any;
    when: any;
    then: any;
  },
  O
> = (Suite, Given, When, Then) => {
  return [
    Suite.Default("TestPageView basic rendering", {
      "renders navigation bar": Given.Default([], [], [Then.RendersNavBar()]),
      "shows error counts": Given.Default([], [], [Then.ShowsErrorCounts()]),
      "shows test results when data exists": Given.Default(
        [],
        [],
        [Then.takeScreenshot("shot.png"), Then.ShowsTestResults()]
      ),
    }),

    Suite.Navigation("TestPageView navigation behavior", {
      "shows results tab by default": Given.Default(
        [],
        [],
        [Then.ShowsActiveTab("results")]
      ),
      "switches to logs tab": Given.Default(
        [],
        [When.SwitchToTab("logs")],
        [Then.ShowsActiveTab("logs"), Then.ShowsLogs()]
      ),
      "copies aider command when button clicked": Given.Default(
        [],
        [When.ClickAiderButton()],
        [Then.AiderButtonCopiesCommand()]
      ),
    }),

    Suite.ErrorStates("TestPageView error handling", {
      "shows error state when tests fail": Given.WithErrors(
        [],
        [],
        [
          Then.ShowsErrorCounts(),
          Then.ShowsTypeErrors(),
          Then.ShowsLintErrors(),
        ]
      ),
      "shows logs when available": Given.WithLogs([], [], [Then.ShowsLogs()]),
    }),
  ];
};

import { ITestSpecification } from "../../../CoreTypes";
import { I, O } from "./types";

export const specification: ITestSpecification<I, O> = (
  Suite,
  Given,
  When,
  Then
) => {
  return [
    Suite.Default("ProjectPageView Component Tests", {
      basicRender: Given.Default(
        [
          "ProjectPageView should render",
          "It should contain a container-fluid div",
          "It should render the NavBar component",
        ],
        [],
        [Then.happyPath()]
      ),
      errorHandling: Given.WithError(
        [
          "ProjectPageView should handle errors",
          "It should display error messages when present",
        ],
        [],
        [Then.unhappyPath()]
      ),
    }),
  ];
};

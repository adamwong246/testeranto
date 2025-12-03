import { ITestSpecification } from "../../../CoreTypes";
import { I, O } from "./types";

export const specification: ITestSpecification<I, O> = (
  Suite,
  Given,
  When,
  Then
) => {
  return [
    Suite.Default("ModalContent Component Tests", {
      basicRender: Given.Default(
        [
          "ModalContent should render",
          "It should contain a Modal.Header",
          "It should render the ThemeCard components",
        ],
        [],
        [
          Then.hasModalHeader(undefined),
          Then.hasThemeCards(undefined),
          Then.takeScreenshot("modal-content.png"),
        ]
      ),
    }),
  ];
};

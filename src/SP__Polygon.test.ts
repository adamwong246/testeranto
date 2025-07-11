import { test6, When, Then } from "../lib";
import { Polygon } from "./SP__Polygon";

test6(
  ["can calculate polygon area"], // Features
  [
    When("given sides", (polygon: Polygon) => polygon.calculateArea()),
  ],
  [
    Then("area should match", (area: number) => expect(area).toBeCloseTo(25)),
  ],
  [5, 5] // Values passed to Given
);

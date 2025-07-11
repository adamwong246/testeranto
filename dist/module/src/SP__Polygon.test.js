import { test6, When, Then } from "../lib";
test6(["can calculate polygon area"], // Features
[
    When("given sides", (polygon) => polygon.calculateArea()),
], [
    Then("area should match", (area) => expect(area).toBeCloseTo(25)),
], [5, 5] // Values passed to Given
);

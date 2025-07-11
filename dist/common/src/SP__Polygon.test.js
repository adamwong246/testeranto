"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
(0, lib_1.test6)(["can calculate polygon area"], // Features
[
    (0, lib_1.When)("given sides", (polygon) => polygon.calculateArea()),
], [
    (0, lib_1.Then)("area should match", (area) => expect(area).toBeCloseTo(25)),
], [5, 5] // Values passed to Given
);

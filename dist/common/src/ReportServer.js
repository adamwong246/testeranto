"use strict";
// simple http server to preview reports
Object.defineProperty(exports, "__esModule", { value: true });
const ReportServerLib_1 = require("./ReportServerLib");
(0, ReportServerLib_1.ReportServerOfPort)(process.argv[2]);

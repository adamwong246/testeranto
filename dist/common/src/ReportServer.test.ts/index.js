"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("../Node"));
const ReportServerLib_1 = require("../ReportServerLib");
const specification = (Suite, Given, When, Then) => [
    Suite.Default("the http server which is used in development", {
        initialization: Given["the http server which is used in development"](["It should serve the front page", "It should serve the ReportApp"], [], [
            Then["the frontpage looks good"](),
            // Then["the projects page looks good"](),
            // Then["a project page looks good"](),
            // Then["a test page looks good"](),
        ]),
    }),
];
const implementation = {
    suites: {
        Default: "the http server which is used in  development",
    },
    givens: {
        "the http server which is used in development": function (subject) {
            // throw new Error("Function not implemented.");
            return subject;
        },
    },
    // There are no "whens", it is a stateless server.
    whens: {},
    thens: {
        "the frontpage looks good": async (port, utils) => {
            // throw new Error("Function not implemented.");
            // utils.newPage(`localhost:${port}`);
            debugger;
            const page = await utils.newPage();
            utils.goto(page, `localhost:${port}`);
            utils.customScreenShot({ path: `frontpage.png` }, page);
            return;
        },
        "the projects page looks good": function () {
            throw new Error("Function not implemented.");
        },
        "a project page looks good": function () {
            throw new Error("Function not implemented.");
        },
        "a test page looks good": function () {
            throw new Error("Function not implemented.");
        },
    },
};
const adapter = {
    assertThis: function (x) {
        throw new Error("Function not implemented.");
    },
    andWhen: function (store, whenCB, testResource, pm) {
        throw new Error("Function not implemented.");
    },
    butThen: function (store, thenCB, testResource, pm) {
        throw new Error("Function not implemented.");
    },
    afterAll: function (store, pm) {
        throw new Error("Function not implemented.");
    },
    afterEach: function (store, key, pm) {
        throw new Error("Function not implemented.");
    },
    beforeAll: async function (input, testResource, pm) {
        await new Promise((res, rej) => input(testResource.ports[0]));
        return testResource.ports[0];
    },
    beforeEach: function (subject, initializer, testResource, initialValues, pm) {
        throw new Error("Function not implemented.");
    },
};
exports.default = (0, Node_1.default)(ReportServerLib_1.ReportServerOfPort, specification, implementation, adapter);

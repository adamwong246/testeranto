"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("./core");
const core_2 = __importDefault(require("./core"));
const NodeWriter_1 = require("./NodeWriter");
exports.default = async (input, testSpecification, testImplementation, testInterface, nameKey, testResourceRequirement = core_1.defaultTestResourceRequirement) => {
    const mrt = new core_2.default(input, testSpecification, testImplementation, testInterface, nameKey, testResourceRequirement, testInterface.assertioner || (async (t) => t), testInterface.beforeEach || async function (subject, initialValues, testResource) {
        return subject;
    }, testInterface.afterEach || (async (s) => s), testInterface.afterAll || ((store) => undefined), testInterface.butThen || (async (a) => a), testInterface.andWhen, testInterface.actionHandler ||
        function (b) {
            return b;
        }, NodeWriter_1.NodeWriter);
    const t = mrt[0];
    const testResourceArg = process.argv[3] || `{}`;
    try {
        NodeWriter_1.NodeWriter.startup(testResourceArg, t, testResourceRequirement);
    }
    catch (e) {
        console.error(e);
        process.exit(-1);
    }
};

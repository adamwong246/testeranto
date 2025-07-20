"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodeSidecar_1 = require("../nodeSidecar");
const Node_1 = __importDefault(require("../../Node"));
const specification = (Suite, Given, When, Then) => {
    return [
        Suite.SidecarInitialized("Sidecar message passing works correctly", {
            basicSend: Given.SidecarReady(["can send and receive messages"], [When.SendTestMessage("test-message")], [Then.MessageReceived("test-message")]),
            cleanup: Given.SidecarReady(["cleans up listeners after message"], [When.VerifyCleanup()], [Then.ListenersCleaned()]),
        }),
    ];
};
const implementation = {
    suites: { SidecarInitialized: (x) => x },
    givens: {
        SidecarReady: () => {
            const config = {
                name: "test-sidecar",
                fs: "/tmp",
                ports: [3001],
                browserWSEndpoint: "",
            };
            return new nodeSidecar_1.PM_Node_Sidecar(config);
        },
    },
    whens: {
        SendTestMessage: (message) => async (sidecar) => {
            let callbackFn;
            const mockProcess = {
                on: (event, callback) => {
                    if (event === "message") {
                        callbackFn = callback;
                        callback(JSON.stringify({
                            key: "mock-key",
                            payload: message,
                        }));
                    }
                    return mockProcess;
                },
                addListener: () => mockProcess,
                removeListener: () => mockProcess,
            };
            process = mockProcess;
            let writeCalled = false;
            sidecar.client.write = (data) => {
                writeCalled = true;
                return true;
            };
            await sidecar.send("test-command", message);
            return { writeCalled, callbackFn };
        },
        VerifyCleanup: () => async (sidecar) => {
            let addListenerCalled = false;
            let removeListenerCalled = false;
            const mockProcess = {
                addListener: () => {
                    addListenerCalled = true;
                    return mockProcess;
                },
                removeListener: () => {
                    removeListenerCalled = true;
                    return mockProcess;
                },
            };
            process = mockProcess;
            await sidecar.send("test-command", "test");
            return { addListenerCalled, removeListenerCalled };
        },
    },
    thens: {
        MessageReceived: (expected) => (actual) => {
            if (actual !== expected) {
                throw new Error(`Expected "${expected}" but got "${actual}"`);
            }
            return actual;
        },
        ListenersCleaned: () => (result, { removeListenerCalled }) => {
            if (!removeListenerCalled) {
                throw new Error("Expected removeListener to be called");
            }
            return result;
        },
    },
};
const testInterface = {
    beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
        const sidecar = initializer();
        sidecar.client = {
            write: () => true,
            end: () => { },
            on: () => { },
        };
        return sidecar;
    },
    andWhen: async (store, whenCB, testResource, pm) => {
        try {
            await whenCB(store, testResource, pm);
        }
        catch (e) {
            console.error("Error in andWhen:", e);
            throw e;
        }
    },
};
exports.default = (0, Node_1.default)(() => new nodeSidecar_1.PM_Node_Sidecar({}), specification, implementation, testInterface);

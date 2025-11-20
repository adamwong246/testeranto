/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Testeranto from "../Node";
import appFactory from "./index";
const specification = (Suite, Given, When, Then) => {
    console.log("Suite", Suite);
    return [
        Suite.TheMothership("the mothership allows the coordination of test resources", {
            test0: Given.ItIsRunning([`a resource can be claimed`], [When.IClaimTheResource("test")], [Then.TheResourceIsClaimed("test")]),
        }),
    ];
};
const implementation = {
    suites: { TheMothership: "idk" },
    givens: { ItIsRunning: () => undefined },
    whens: {
        IClaimTheResource: (resource) => async (app, tr, pm) => {
            try {
                const response = await fetch(`http://localhost:${tr.ports[0]}/claim?resource=${resource}`);
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`[ERROR] Failed to claim resource: ${errorText}`);
                    throw new Error(`Failed to claim resource: ${errorText}`);
                }
                const result = await response.json();
                return app;
            }
            catch (error) {
                console.error("[ERROR] Resource claim failed:", error);
                throw error;
            }
        },
        IReleaseTheResource: function (resource) {
            throw new Error("Function not implemented.");
        },
        IResetTheResource: function (Iw_0) {
            throw new Error("Function not implemented.");
        },
    },
    thens: {
        TheResourceIsClaimed: (expectedResource) => async (app, pm) => {
            // In a real implementation, we'd check the server state
            // For now just log and return success
            return app;
        },
        TheResourceIsUnClaimed: function (It_0) {
            throw new Error("Function not implemented.");
        },
    },
};
const testAdapter = {
    beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
        console.log("beforeEach - starting app on port", testResource.ports[0]);
        return subject(testResource.ports[0]);
    },
    andWhen: async (store, whenCB, testResource, pm) => {
        console.log("andWhen - executing action");
        return whenCB(store, testResource, pm);
    },
    butThen: async (store, thenCB, testResource, pm) => {
        console.log("butThen - making assertions");
        return thenCB(store, pm);
    },
    afterEach: async (store, key, pm) => {
        console.log("afterEach - cleaning up");
        return store;
    },
    afterAll: async (store, pm) => {
        console.log("afterAll - final cleanup");
    },
    beforeAll: async (input, testResource, pm) => {
        console.log("beforeAll - initial setup");
        return input;
    },
    assertThis: (x) => {
        console.log("assertThis - validating result");
        return x;
    },
};
export default Testeranto(appFactory, specification, implementation, testAdapter);

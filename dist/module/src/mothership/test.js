import Testeranto from "../Node";
import appFactory from "./index";
const specification = (Suite, Given, When, Then) => {
    console.log("Suite", Suite);
    return [
        Suite.TheMothership("the mothership allows the coordination of test resources", {
            test0: Given.ItIsRunning([`a resource can be claimed`], [When.IClaimTheResource("test")], [
            // Then.TheResourceIsClaimed("test")
            ]),
        }, []),
    ];
};
const implementation = {
    suites: { TheMothership: (x) => x },
    givens: { ItIsRunning: () => undefined },
    whens: {
        IClaimTheResource: (resource) => async (i, tr, p) => {
            fetch(`http://localhost:${tr.ports[0]}/claim?${resource}`);
        },
        IReleaseTheResource: function (resource) {
            throw new Error("Function not implemented.");
        },
        IResetTheResource: function (Iw_0) {
            throw new Error("Function not implemented.");
        },
    },
    thens: {
        TheResourceIsClaimed: (resource) => async (z, u) => {
            throw new Error("Function not implemented.");
        },
        TheResourceIsUnClaimed: function (It_0) {
            throw new Error("Function not implemented.");
        },
    },
};
const testAdapter = {
    // assertThis: function (x: any) {
    //   throw new Error("Function not implemented.");
    // },
    // andWhen: function (store: any, whenCB: any, testResource: ITTestResourceConfiguration, pm: IPM): Promise<any> {
    //   throw new Error("Function not implemented.");
    // },
    // butThen: function (store: any, thenCB: any, testResource: ITTestResourceConfiguration, pm: IPM): Promise<any> {
    //   throw new Error("Function not implemented.");
    // },
    // afterAll: function (store: any, pm: IPM) {
    //   throw new Error("Function not implemented.");
    // },
    // afterEach: function (store: any, key: string, pm: IPM): Promise<unknown> {
    //   throw new Error("Function not implemented.");
    // },
    // beforeAll: function (input: Express, testResource: ITTestResourceConfiguration, pm: IPM): Promise<any> {
    //   throw new Error("Function not implemented.");
    // },
    beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
        return subject(testResource.ports[0]);
    },
};
export default Testeranto(appFactory, specification, implementation, testAdapter);

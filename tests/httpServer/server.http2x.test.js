import { Http2xTesteranto } from "./http2x.testeranto.test";
import { serverFactory } from "./server";
const myFeature = `hello`;
export const ServerHttp2xTesteranto = Http2xTesteranto({
    Suites: {
        Default: "some default Suite",
    },
    Givens: {
        /* @ts-ignore:next-line */
        AnEmptyState: () => {
            return {};
        },
    },
    Whens: {
        PostToStatusA: (status) => ["put_status", status, 0],
        PostToAddA: (n) => ["put_number", n.toString(), 0],
        PostToStatusB: (status) => ["put_status", status, 1],
        PostToAddB: (n) => ["put_number", n.toString(), 1],
    },
    Thens: {
        TheStatusIsA: (status) => () => ["get_status", status, 0],
        TheNumberIsA: (number) => () => ["get_number", number, 0],
        TheStatusIsB: (status) => () => ["get_status", status, 1],
        TheNumberIsB: (number) => () => ["get_number", number, 1],
    },
    Checks: {
        /* @ts-ignore:next-line */
        AnEmptyState: () => {
            return {};
        },
    },
}, (Suite, Given, When, Then, Check) => {
    return [
        Suite.Default("Testing the Node server with fetch * 2 ports", [
            Given.AnEmptyState([myFeature], [], [Then.TheStatusIsA("some great status")]),
            Given.AnEmptyState([myFeature], [
                When.PostToStatusA("gutentag"),
                When.PostToStatusB("buenos dias"),
            ], [
                Then.TheStatusIsA("gutentag"),
                Then.TheStatusIsB("buenos dias"),
            ]),
        ], []),
    ];
}, serverFactory);

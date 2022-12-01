import { mapValues } from "lodash";
import { TesterantoBasic } from "./base/level1/TesterantoBasic";
export const Testeranto = (store, tests, CSuite, CGiven, CWhen, CThen, CCheck) => {
    return {
        thens: (ts) => {
            return ts;
        },
        run: async (suites, givens, whens, thens, checks //ISimpleChecks<ICheckExtensions, IState>,
        ) => {
            const classySuites = mapValues(suites, (suite) => {
                return (somestring, givens, checks) => {
                    return new CSuite(somestring, givens, checks);
                };
            });
            const classyGivens = mapValues(givens, (z) => {
                return (feature, whens, thens, ...xtrasW) => {
                    return new CGiven(feature, whens, thens, z(...xtrasW));
                };
            });
            const classyWhens = mapValues(whens, (whEn) => {
                return (payload) => {
                    return new CWhen(`${whEn.name}: ${payload && payload.toString()}`, whEn(payload));
                };
            });
            const classyThens = mapValues(thens, (thEn) => {
                return (expected, x) => {
                    return new CThen(`${thEn.name}: ${expected && expected.toString()}`, thEn(expected));
                };
            });
            const classyChecks = mapValues(checks, (z) => {
                return (somestring, callback) => {
                    return new CCheck(somestring, callback, 
                    // somestring,
                    classyWhens, classyThens);
                };
            });
            class MetaTesteranto extends TesterantoBasic {
            }
            const testerano = new MetaTesteranto(
            /* @ts-ignore:next-line */
            store, classySuites, classyGivens, classyWhens, classyThens, classyChecks);
            /* @ts-ignore:next-line */
            const t = tests(testerano.Suites(), testerano.Given(), testerano.When(), 
            /* @ts-ignore:next-line */
            testerano.Then(), testerano.Check());
            return t.map((tt) => {
                return {
                    test: tt,
                    runner: async () => {
                        await tt.run(store);
                    },
                };
            });
        },
    };
};

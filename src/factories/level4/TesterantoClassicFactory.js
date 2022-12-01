import { mapValues } from "lodash";
import { ClassyGiven, ClassyWhen, ClassyThen, ClassyCheck, } from "../../classical/level2/TesterantoClasses";
import { TesterantoClassic } from "../../classical/level3/TesteranoClassic";
export const TesterantoClassicFactory = (thing, tests) => {
    return {
        run: (suites, givens, whens, thens, checks //ISimpleGivens<IGS, Klass>
        ) => {
            const classyGivens = mapValues(givens, (z) => {
                return (whens, thens, ...xtras) => {
                    return new ClassyGiven(`idk`, 
                    /* @ts-ignore:next-line */
                    whens, thens, z(...xtras));
                };
            });
            const classyWhens = mapValues(whens, (testHookImplementation) => {
                return (arg0) => new ClassyWhen(`${testHookImplementation.name}: ${arg0.toString()}`, (x) => testHookImplementation(x, arg0));
            });
            const classThens = mapValues(thens, (thEn) => {
                return (expected) => {
                    return new ClassyThen(`${thEn.name}: ${expected.toString()}`, (rectangle) => thEn(rectangle, expected));
                };
            });
            const classyChecks = mapValues(checks, (z) => {
                return (callback, whens, thens, thing) => {
                    return new ClassyCheck(`IDK`, callback, whens, thens, thing);
                };
            });
            const testerano = new TesterantoClassic(thing, {}, classyGivens, classyWhens, classThens, classyChecks);
            const t = tests(
            /* @ts-ignore:next-line */
            testerano.Suites(), testerano.Given(), testerano.When(), 
            /* @ts-ignore:next-line */
            testerano.Then(), testerano.Checks());
            return t.map((tt) => {
                return {
                    test: tt,
                    runner: async () => {
                        await tt.run(thing);
                    },
                };
            });
        },
    };
};

import { mapValues } from "lodash";

import {
  ClassyGiven,
  ClassySuite,
  ClassyWhen,
  ClassyThen,
  ClassyCheck,
} from "../../classical/level2/TesterantoClasses";
import { TesterantoClassic } from "../../classical/level3/TesteranoClassic";
import {
  ISimpleGivens,
  ISimpleSuites,
  ITypeDeTuple,
  ISimpleWhens,
} from "../../shared";

type IZ<T, Klass> = {
  [K in keyof T]: (
    /* @ts-ignore:next-line */
    ...arg1: T[K]
  ) => ClassyThen<Klass>;
};

type IZW<T, Klass> = {
  [K in keyof T]: (
    /* @ts-ignore:next-line */
    ...arg1: T[K]
  ) => ClassyWhen<Klass>;
};

type IC<T, Klass> = {
  [K in keyof T]: (
    /* @ts-ignore:next-line */
    ...arg1: T[K]
  ) => ClassyCheck<Klass>;
};

export const TesterantoClassicFactory = <Klass, ISS, IGS, IWS, ITS, ICS>(
  thing,
  tests: (
    s: Record<
      keyof ISS,
      (ss: ClassyGiven<Klass>[], cc: ClassyCheck<Klass>[]) => ClassySuite<Klass>
    >,
    g: Record<
      keyof IGS,
      (ww: ClassyWhen<Klass>[], tt: ClassyThen<Klass>[]) => ClassyGiven<Klass>
    >,
    w: IZW<IWS, Klass>,
    t: IZ<ITS, Klass>,
    c: IC<ICS, Klass>
  ) => ClassySuite<Klass>[]
) => {
  console.log("mark3", tests);

  return {
    run: (
      suites: ISimpleSuites<ISS>,
      givens: ISimpleGivens<IGS, Klass>,
      whens: ISimpleWhens<IWS, Klass>,
      thens: ITypeDeTuple<ITS, Klass>,
      checks: any //ISimpleGivens<IGS, Klass>
    ) => {
      const classySuites = mapValues(suites as any, (z) => {
        return (x) => {
          return new ClassySuite<Klass>(x);
        };
      }) as {
        [K in keyof ISS]: (name: string) => ClassySuite<Klass>;
      };

      const classyGivens = mapValues(givens as any, (z) => {
        return (whens, thens, ...xtras) => {
          return new ClassyGiven(
            `idk`,
            /* @ts-ignore:next-line */
            whens,
            thens,
            z(...xtras)
          );
        };
      }) as {
        [K in keyof IGS]: (
          name: string,
          whens: ClassyWhen<Klass>[],
          thens: ClassyThen<Klass>[]
        ) => ClassyGiven<Klass>;
      };

      const classyWhens = mapValues(
        whens as any,
        (testHookImplementation: (thing: Klass, expectation: any) => any) => {
          return (arg0: any) =>
            new ClassyWhen(
              `${testHookImplementation.name}: ${arg0.toString()}`,

              (x) => testHookImplementation(x, arg0)
            );
        }
      ) as unknown as {
        [K in keyof IWS]: (c: Klass) => ClassyWhen<Klass>;
      };

      const classThens = mapValues(
        thens as any,
        (thEn: (klass, ...xtras) => void) => {
          return (expected: any) => {
            return new ClassyThen(
              `${thEn.name}: ${expected.toString()}`,
              (rectangle) => thEn(rectangle, expected)
            );
          };
        }
      ) as unknown as {
        [K in keyof ITS]: (c: Klass) => ClassyThen<Klass>;
      };

      const classyChecks = mapValues(checks as any, (z) => {
        return (callback, whens, thens, thing) => {
          return new ClassyCheck(`IDK`, callback, whens, thens, thing);
        };
      }) as {
        [K in keyof ICS]: (name: string, callback) => ClassyCheck<Klass>;
      };

      const testerano = new TesterantoClassic<
        Klass,
        {
          [S in keyof ISS]: (feature: string) => ClassySuite<Klass>;
        },
        {
          [K in keyof IGS]: (
            feature: string,
            whens: ClassyWhen<Klass>[],
            thens: ClassyThen<Klass>[]
          ) => ClassyGiven<Klass>;
        },
        {
          [K in keyof IWS]: (...any) => ClassyWhen<Klass>;
        },
        {
          [K in keyof ITS]: (...any) => ClassyThen<Klass>;
        },
        {
          [K in keyof ICS]: (
            feature: string,
            callback: (whens, thens) => any,
            whens,
            thens
          ) => ClassyCheck<Klass>;
        }
      >(
        thing,
        classySuites,
        classyGivens,
        classyWhens,
        classThens,
        classyChecks
      );

      console.log("mark2", classySuites);
      process.exit(1);
      const t = tests(
        /* @ts-ignore:next-line */
        testerano.Suites(),
        testerano.Given(),
        testerano.When(),
        /* @ts-ignore:next-line */
        testerano.Then(),
        testerano.Checks()
      );

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

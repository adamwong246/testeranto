import { mapValues } from "lodash";
import {
  ClassyGiven,
  ClassySuite,
  ClassyWhen,
  ClassyThen,
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

export const TesterantoClassicFactory = <Klass, ISS, IGS, IWS, ITS>(
  thing,
  tests: (
    s: Record<
      keyof ISS | "Default",
      (ss: ClassyGiven<Klass>[]) => ClassySuite<Klass>
    >,
    g: Record<
      keyof IGS,
      (ww: ClassyWhen<Klass>[], tt: ClassyThen<Klass>[]) => ClassyGiven<Klass>
    >,
    w: IZW<IWS, Klass>,
    t: IZ<ITS, Klass>
  ) => ClassySuite<Klass>[]
) => {
  return {
    run: (
      suites: ISimpleSuites<ISS>,
      givens: ISimpleGivens<IGS, Klass>,
      whens: ISimpleWhens<IWS, Klass>,
      thens: ITypeDeTuple<ITS, Klass>
    ) => {
      const classyGivens = mapValues(givens as any, (z) => {
        return (whens, thens, ...xtras) => {
          return new ClassyGiven(
            `width of 1 and height of 1`,
            /* @ts-ignore:next-line */
            whens,
            thens,
            "idk feature",
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
      const testerano = new TesterantoClassic<
        Klass,
        {},
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
        }
      >(thing, {}, classyGivens, classyWhens, classThens);
      tests(
        /* @ts-ignore:next-line */
        testerano.Suites(),
        testerano.Given(),
        testerano.When(),
        testerano.Then()
      ).forEach((test) => {
        test.test(thing);
      });
    },
  };
};

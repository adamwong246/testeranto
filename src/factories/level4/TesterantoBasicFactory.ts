import { TesterantoBasic } from "../../base/level1/TesterantoBasic";
import { ISimpleGivens, ISimpleWhens, ITypeDeTuple } from "../../shared";

export const TesterantoBasicFactory = <
  IState,
  IStore,
  ISelection,
  IBasicTesteranto extends TesterantoBasic<
    IStore,
    IState,
    any,
    any,
    any,
    any,
    any,
    ICheckExtensions
    // IThatExtensions
  >,
  IGS,
  IWS,
  ITS,
  ICheckExtensions
  // IThatExtensions
>(
  testerano: IBasicTesteranto,
  suites: any,
  givens: ISimpleGivens<IGS, IStore>[],
  whens: ISimpleWhens<IWS, IState>,
  thens: ITypeDeTuple<ITS, ISelection>,
  checks: any
  // thats: any
): IBasicTesteranto => {
  return testerano;
};

import { Ibdd_in_any, Ibdd_out_any, ITestSpecification } from "../CoreTypes";

export const mockTestSpecification = (): ITestSpecification<
  Ibdd_in_any,
  Ibdd_out_any
> => {
  return () => {
    return new BaseSuite();
  };
};

import { TesterantoFeatures } from "./Features";
import { ITestTypes } from "./Project";

export type ICollateMode =
  | "on"
  | "off"
  | "watch"
  | `serve`
  | `watch+serve`
  | `dev`;

export type IBaseConfig = {
  clearScreen: boolean;
  collateMode: ICollateMode;
  features: TesterantoFeatures;
  loaders: any[];
  minify: boolean;
  outbase: string;
  outdir: string;
  ports: string[];
  // collateDir: string;
  collateEntry: string;
  // resultsdir: string;
  runMode: boolean;
  tests: ITestTypes;
  buildMode: "on" | "off" | "watch";
};

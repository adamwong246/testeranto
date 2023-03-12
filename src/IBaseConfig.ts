import { TesterantoFeatures } from "./Features";

export type ICollateMode = 'on' | 'off' | 'watch' | `serve` | `watch+serve`;

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
  resultsdir: string;
  runMode: boolean;
  tests: string[];
  buildMode: 'on' | 'off' | 'watch';
};
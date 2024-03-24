// export type ICollateMode =
//   | "on"
//   | "off"
//   | "watch"
//   | `serve`
//   | `watch+serve`
//   | `dev`;

export type IBaseConfig = {
  clearScreen: boolean;
  loaders: any[];
  minify: boolean;
  outbase: string;
  outdir: string;
  ports: string[];
  __dirname: string;

  devMode: boolean;

  // collateMode: ICollateMode;

  // collateDir: string;
  // collateEntry: string;
  // resultsdir: string;
  // runMode: boolean;
  // buildMode: "on" | "off" | "watch";


  tests: string;
  features: string;
};

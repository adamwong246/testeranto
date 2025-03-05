import fs from "fs";

export default async (partialConfig) => {
  const config = {
    ...partialConfig,
    buildDir: process.cwd() + "/" + partialConfig.outdir,
  };

  fs.writeFileSync(
    `${config.outdir}/testeranto.json`,
    JSON.stringify(
      {
        ...config,
        buildDir: process.cwd() + "/" + config.outdir,
      },
      null,
      2
    )
  );
};

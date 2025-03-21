import fs from "fs";

export default async (partialConfig) => {
  const config = {
    ...partialConfig,
    buildDir: process.cwd() + "/" + partialConfig.outdir,
  };

  try {
    fs.mkdirSync(`${process.cwd()}/${config.outdir}`);
  } catch {
    // console.log()
  }

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

  try {
    fs.mkdirSync(`${process.cwd()}/${config.outdir}/node`);
  } catch {
    // console.log()
  }

  try {
    fs.mkdirSync(`${process.cwd()}/${config.outdir}/web`);
  } catch {
    // console.log()
  }
  try {
    fs.mkdirSync(`${process.cwd()}/${config.outdir}/features`);
  } catch {
    // console.log()
  }
  try {
    fs.mkdirSync(`${process.cwd()}/${config.outdir}/ts`);
  } catch {
    // console.log()
  }
};

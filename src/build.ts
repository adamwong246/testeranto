import { TesterantoProject } from "./Project"

console.log("build.ts", process.cwd(), process.argv);

const configFile = `${process.cwd()}/${process.argv[2]}`;

console.log("build.ts configFile", configFile);

import(configFile).then((configModule) => {

  const tProject = new TesterantoProject(
    configModule.default[0], configModule.default[1], configModule.default[2]
  );

  const featureFile = `${process.cwd()}/${tProject.features}`;
  // console.log("build.ts featureFile", featureFile);

  // console.log("build.ts tProject", tProject);

  import(featureFile).then(features => {
    features.default.builder();
    console.log("dynamicly exporting the features");
  });

  tProject.tests.forEach(([key, testSourcefile, className]) => {

    const sourcefile = `${process.cwd()}/${testSourcefile}`;
    console.log("build.ts sourcefile", sourcefile);
    // console.log("build.ts className", className);

    import(sourcefile).then(testSuite => {
      console.log("dynamicly exporting", key)
      try {
        new testSuite[className]()[0].builder(sourcefile, featureFile)
      } catch (e) {
        console.error(className);
        console.error(testSuite);
        console.error(e);
      }
    });
  })

  tProject.builder()
})


export { }

import { TesterantoProject } from "./Project"

console.log("build.ts", process.cwd(), process.argv);

const configFile = `${process.cwd()}/${process.argv[2]}`;

console.log("build.ts configFile", configFile);

import(configFile).then((configModule) => {

  const tProject = new TesterantoProject(configModule.default[0], configModule.default[1], configModule.default[2])
  // console.log("build.ts tProject", tProject);

  import(configFile).then(features => {
    features.default.builder();
    console.log("dynamicly exporting the features");
  });

  tProject.tests.forEach(([key, sourcefile, className]) => {

    const featureFile = `${process.cwd()}/${tProject.features}`;

    console.log("build.ts featureFile", featureFile);

    import(featureFile).then(testSuite => {
      console.log("dynamicly exporting", key)
      try {
        new testSuite[className]()[0].builder(sourcefile, tProject.features)
      } catch (e) {
        console.error(className);
        console.error(testSuite[className].toString());
        console.error(e);
      }
    });
  })

  tProject.builder()
})


export { }

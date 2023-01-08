import { TesterantoProject } from "./Project"

const configFile = `${process.cwd()}/${process.argv[2]}`;

import(configFile).then((configModule) => {
  const tProject = new TesterantoProject(configModule.default[0], configModule.default[1], configModule.default[2])

  import("../" + tProject.features).then(features => {
    features.default.builder();
    console.log("dynamicly exporting the features");
  });

  tProject.tests.forEach(([key, sourcefile, className]) => {

    import("../" + sourcefile).then(testSuite => {
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

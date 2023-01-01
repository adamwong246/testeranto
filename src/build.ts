import testerantoConfig from "../testeranto.config";

import("../" + testerantoConfig.features).then(features => {
  features.default.builder();
  console.log("dynamicly exporting the features");
});

testerantoConfig.tests.forEach(([key, sourcefile, className]) => {
  import("../" + sourcefile).then(testSuite => {
    console.log("dynamicly exporting", key)
    new testSuite[className]()[0].builder()
  });
})

testerantoConfig.builder()

export { }

// eslint-disable-next-line @typescript-eslint/no-var-requires
const testerantoConfig = require("./testeranto.config");

testerantoConfig.forEach(([key, sourcefile, className]) => {  
  import(sourcefile).then(testSuite => {
    console.log("dynamicly importing", key)
    new testSuite[className]()[0].builder()
  });
})

export { }

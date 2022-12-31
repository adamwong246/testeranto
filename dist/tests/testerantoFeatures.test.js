// tests/testerantoFeatures.test.ts
import { BaseFeature } from "/Users/adam/Code/testeranto.ts/tests/../src/BaseClasses.ts";
import { TesterantoFeatures } from "/Users/adam/Code/testeranto.ts/tests/../src/Features.ts";
var features = {
  hello: new BaseFeature("hello"),
  aloha: new BaseFeature("aloha")
};
var testerantoFeatures_test_default = new TesterantoFeatures([
  features.hello,
  features.aloha
], __filename);
export {
  testerantoFeatures_test_default as default,
  features
};

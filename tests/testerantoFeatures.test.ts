import { BaseFeature } from "../src/BaseClasses";
import { TesterantoFeatures } from "../src/Features";

export const features = {
  hello: new BaseFeature("hello"),
  aloha: new BaseFeature("aloha"),
}

export default new TesterantoFeatures([
  features.hello, features.aloha
], __filename);

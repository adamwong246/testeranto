import { BaseFeature } from "../src/BaseClasses";
import { TesterantoFeatures } from "../src/Features";

export const features = {
  hello: new BaseFeature("hello"),
  aloha: new BaseFeature("aloha"),
  gutentag: new BaseFeature("gutentag"),
}

export default new TesterantoFeatures([
  features.hello, features.aloha, features.gutentag
], __filename);

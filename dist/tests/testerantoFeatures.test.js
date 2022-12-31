// tests/testerantoFeatures.test.ts
import { BaseFeature } from "/Users/adam/Code/testeranto.ts/tests/../src/BaseClasses.ts";
import { TesterantoFeatures } from "/Users/adam/Code/testeranto.ts/tests/../src/Features.ts";
import { DirectedGraph } from "graphology";
var features = {
  hello: new BaseFeature("hello"),
  aloha: new BaseFeature("aloha"),
  gutentag: new BaseFeature("gutentag"),
  buenosDias: new BaseFeature("buenos dias"),
  hola: new BaseFeature("hola"),
  bienVenidos: new BaseFeature("bien venidos")
};
var graph = new DirectedGraph();
graph.mergeEdge(features.hello.name, features.aloha.name);
graph.mergeEdge(features.hello.name, features.gutentag.name);
graph.mergeEdge(features.gutentag.name, features.buenosDias.name);
var testerantoFeatures_test_default = new TesterantoFeatures([
  features.hello,
  features.aloha,
  features.gutentag,
  features.buenosDias,
  features.hola,
  features.bienVenidos
], [{ name: "my first graph", graph }], __filename);
export {
  testerantoFeatures_test_default as default,
  features
};

// tests/testerantoFeatures.test.ts
import { BaseFeature } from "/Users/adam/Code/testeranto.ts/tests/../src/BaseClasses.ts";
import { TesterantoFeatures } from "/Users/adam/Code/testeranto.ts/tests/../src/Features.ts";
import { DirectedGraph } from "graphology";
import { hasCycle } from "graphology-dag";
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
graph.mergeEdge(features.hola.name, features.gutentag.name);
graph.mergeEdge(features.gutentag.name, features.bienVenidos.name);
if (hasCycle(graph)) {
  console.error("graph has cycles!");
  process.exit(-1);
}
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

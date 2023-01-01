import { BaseFeature } from "../src/BaseClasses";
import { TesterantoFeatures } from "../src/Features";

export const features = {
  hello: new BaseFeature("hello"),
  aloha: new BaseFeature("aloha"),
  gutentag: new BaseFeature("gutentag"),
  buenosDias: new BaseFeature("buenos dias"),
  hola: new BaseFeature("hola"),
  bienVenidos: new BaseFeature("bien venidos"),
}

import { DirectedGraph } from 'graphology';
import { hasCycle } from 'graphology-dag';

const graph = new DirectedGraph();
graph.mergeEdge(features.hello.name, features.aloha.name);
graph.mergeEdge(features.hello.name, features.gutentag.name);
graph.mergeEdge(features.gutentag.name, features.buenosDias.name);
graph.mergeEdge(features.hola.name, features.gutentag.name);
graph.mergeEdge(features.gutentag.name, features.bienVenidos.name);

if (hasCycle(graph)) {
  console.error("graph has cycles!")
  process.exit(-1)
}

export default new TesterantoFeatures([
  features.hello,
  features.aloha,
  features.gutentag,
  features.buenosDias,
  features.hola,
  features.bienVenidos
], [{ name: "my first graph", graph }], __filename);

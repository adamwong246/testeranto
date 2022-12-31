import { BaseFeature } from "../src/BaseClasses";
import { TesterantoFeatures } from "../src/Features";

export const features = {
  hello: new BaseFeature("hello"),
  aloha: new BaseFeature("aloha"),
  gutentag: new BaseFeature("gutentag"),
  buenosDias: new BaseFeature("buenos dias"),
}

import { DirectedGraph } from 'graphology';
import { hasCycle } from 'graphology-dag';


const graph = new DirectedGraph();
graph.mergeEdge(features.hello.name, features.aloha.name);
graph.mergeEdge(features.hello.name, features.gutentag.name);
graph.mergeEdge(features.gutentag.name, features.buenosDias.name);

export default new TesterantoFeatures([
  features.hello, features.aloha, features.gutentag, features.buenosDias
], [graph], __filename);

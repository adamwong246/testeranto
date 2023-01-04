// tests/testerantoFeatures.test.ts
import { BaseFeature } from "/Users/adam/Code/testeranto.ts/tests/../src/BaseClasses.ts";
import { TesterantoFeatures, TesterantoGraphDirected, TesterantoGraphDirectedAcylic, TesterantoGraphUndirected } from "/Users/adam/Code/testeranto.ts/tests/../src/Features.ts";
var MyFeature = class extends BaseFeature {
  constructor(name, due) {
    super(name);
    this.due = due;
  }
};
var features = {
  root: new MyFeature("launch the rocket"),
  buildSilo: new MyFeature("build the rocket silo", new Date("2023-05-02T02:36:34+0000")),
  buildRocket: new MyFeature("build the rocket", new Date("2023-06-06T02:36:34+0000")),
  buildSatellite: new MyFeature("build the rocket payload", new Date("2023-06-06T02:36:34+0000")),
  hello: new MyFeature("hello"),
  aloha: new MyFeature("aloha"),
  gutentag: new MyFeature("gutentag"),
  buenosDias: new MyFeature("buenos dias"),
  hola: new MyFeature("hola"),
  bienVenidos: new MyFeature("bien venidos")
};
var priorityGraph = new TesterantoGraphDirectedAcylic("Priority");
priorityGraph.connect(features.root.name, features.hello.name);
priorityGraph.connect(features.hello.name, features.aloha.name);
var semantic = new TesterantoGraphDirected("Semantic");
semantic.connect(features.hello.name, features.aloha.name, "superceedes");
semantic.connect(features.gutentag.name, features.hola.name, "negates");
var undirected = new TesterantoGraphUndirected("undirected");
undirected.connect(features.gutentag.name, features.aloha.name, "related");
undirected.connect(features.buildRocket.name, features.buildSatellite.name, "overlap");
var testerantoFeatures_test_default = new TesterantoFeatures(
  [
    features.hello,
    features.aloha,
    features.gutentag,
    features.buenosDias,
    features.hola,
    features.bienVenidos
  ],
  {
    undirected: [undirected],
    directed: [semantic],
    dags: [priorityGraph]
  },
  __filename
);
export {
  MyFeature,
  testerantoFeatures_test_default as default,
  features
};

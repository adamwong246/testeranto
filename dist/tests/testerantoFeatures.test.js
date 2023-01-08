// node_modules/testeranto/tests/testerantoFeatures.test.ts
import { BaseFeature } from "/Users/adam/Code/kokomoBay/node_modules/testeranto/tests/../src/BaseClasses";
import { TesterantoFeatures, TesterantoGraphDirected, TesterantoGraphDirectedAcylic, TesterantoGraphUndirected } from "/Users/adam/Code/kokomoBay/node_modules/testeranto/tests/../src/Features";
var MyFeature = class extends BaseFeature {
  due;
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
priorityGraph.connect(features.root.name, features.buildSilo.name);
priorityGraph.connect(features.buildSilo.name, features.buildRocket.name);
priorityGraph.connect(features.buildRocket.name, features.buildSatellite.name);
priorityGraph.connect(features.root.name, features.hello.name);
priorityGraph.connect(features.hello.name, features.aloha.name);
priorityGraph.connect(features.hello.name, features.gutentag.name);
priorityGraph.connect(features.gutentag.name, features.buenosDias.name);
priorityGraph.connect(features.hola.name, features.gutentag.name);
priorityGraph.connect(features.gutentag.name, features.bienVenidos.name);
var semantic = new TesterantoGraphDirected("some semantic directed graph");
semantic.connect(features.hello.name, features.aloha.name, "superceedes");
semantic.connect(features.gutentag.name, features.hola.name, "negates");
var undirected = new TesterantoGraphUndirected("an undirected semantic graph");
undirected.connect(features.gutentag.name, features.aloha.name, "related");
undirected.connect(features.buildRocket.name, features.buildSatellite.name, "overlap");
var testerantoFeatures_test_default = new TesterantoFeatures(
  [
    features.hello,
    features.aloha,
    features.gutentag,
    features.buenosDias,
    features.hola,
    features.bienVenidos,
    features.root,
    features.buildSilo,
    features.buildRocket,
    features.buildSatellite
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

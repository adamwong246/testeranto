// tests/testerantoFeatures.test.js
import { BaseFeature, TesterantoFeatures, TesterantoGraphDirected, TesterantoGraphDirectedAcyclic, TesterantoGraphUndirected } from "testeranto";
var MyFeature = class extends BaseFeature {
  constructor(name, due) {
    super(name);
    this.due = due;
  }
};
var features = {
  root: new MyFeature("kokomo bay"),
  mint: new MyFeature("An ERC721 which is redeemable"),
  redemption: new MyFeature("Redeems an ERC-721, marking its state as redeemed"),
  federatedSplitContract: new MyFeature("A website which can acts as a storefront"),
  markRedeemed: new MyFeature("Registers contract status as redeemed, and changes image"),
  encryptShipping: new MyFeature("Buyer encrypts plaintext message and stores value on contract"),
  decryptShipping: new MyFeature("Vendor Decrypts plaintext message"),
  buildSilo: new MyFeature("build the rocket silo", /* @__PURE__ */ new Date("2023-05-02T02:36:34+0000")),
  buildRocket: new MyFeature("build the rocket", /* @__PURE__ */ new Date("2023-06-06T02:36:34+0000")),
  buildSatellite: new MyFeature("build the rocket payload", /* @__PURE__ */ new Date("2023-06-06T02:36:34+0000")),
  hello: new MyFeature("hello"),
  aloha: new MyFeature("aloha"),
  gutentag: new MyFeature("gutentag"),
  buenosDias: new MyFeature("buenos dias"),
  hola: new MyFeature("hola"),
  bienVenidos: new MyFeature("bien venidos")
};
var priorityGraph = new TesterantoGraphDirectedAcyclic("Priority");
priorityGraph.connect(`root`, `redemption`);
priorityGraph.connect(`root`, `federatedSplitContract`);
priorityGraph.connect(`root`, `mint`);
priorityGraph.connect(`redemption`, `markRedeemed`);
priorityGraph.connect(`redemption`, `encryptShipping`);
priorityGraph.connect(`redemption`, `decryptShipping`);
var semantic = new TesterantoGraphDirected("some semantic directed graph");
semantic.connect(`hello`, `aloha`, "superceedes");
semantic.connect(`gutentag`, `hola`, "negates");
var undirected = new TesterantoGraphUndirected("an undirected semantic graph");
undirected.connect(`gutentag`, `aloha`, "related");
undirected.connect(`buildRocket`, `buildSatellite`, "overlap");
var testerantoFeatures_test_default = new TesterantoFeatures(features, {
  undirected: [
    undirected
  ],
  directed: [
    semantic
  ],
  dags: [
    priorityGraph
  ]
});
export {
  MyFeature,
  testerantoFeatures_test_default as default,
  features
};

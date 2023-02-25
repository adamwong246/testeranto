// tests/testerantoFeatures.test.ts
import { BaseFeature, TesterantoFeatures } from "testeranto";
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
var testerantoFeatures_test_default = new TesterantoFeatures(
  [
    features.redemption,
    features.federatedSplitContract,
    features.mint,
    features.markRedeemed,
    features.encryptShipping,
    features.decryptShipping,
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
    undirected: [
      // undirected
    ],
    directed: [
      // semantic
    ],
    dags: [
      // priorityGraph
    ]
  }
);
export {
  MyFeature,
  testerantoFeatures_test_default as default,
  features
};

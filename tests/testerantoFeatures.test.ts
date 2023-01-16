
import { BaseFeature } from "testeranto/src/BaseClasses";
import { TesterantoFeatures, TesterantoGraphDirected, TesterantoGraphDirectedAcylic, TesterantoGraphUndirected } from "testeranto/src/Features";

export class MyFeature extends BaseFeature {
  due?: Date;
  constructor(name: string, due?: Date) {
    super(name);
    this.due = due;
  }
}

export const features = {
  root: new MyFeature("kokomo bay"),

  mint: new MyFeature("An ERC721 which is redeemable"),
  redemption: new MyFeature("Redeems an ERC-721, marking its state as redeemed"),
  federatedSplitContract: new MyFeature("A website which can acts as a storefront"),
  markRedeemed: new MyFeature("Registers contract status as redeemed, and changes image"),
  encryptShipping: new MyFeature("Buyer encrypts plaintext message and stores value on contract"),
  decryptShipping: new MyFeature("Vendor Decrypts plaintext message"),

  buildSilo: new MyFeature("build the rocket silo", new Date('2023-05-02T02:36:34+0000')),
  buildRocket: new MyFeature("build the rocket", new Date('2023-06-06T02:36:34+0000')),
  buildSatellite: new MyFeature("build the rocket payload", new Date('2023-06-06T02:36:34+0000')),
  hello: new MyFeature("hello"),
  aloha: new MyFeature("aloha"),
  gutentag: new MyFeature("gutentag"),
  buenosDias: new MyFeature("buenos dias"),
  hola: new MyFeature("hola"),
  bienVenidos: new MyFeature("bien venidos"),
};

const priorityGraph = new TesterantoGraphDirectedAcylic("Priority");

priorityGraph.connect(features.root.name, features.redemption.name);
priorityGraph.connect(features.root.name, features.federatedSplitContract.name);
priorityGraph.connect(features.root.name, features.mint.name);
priorityGraph.connect(features.redemption.name, features.markRedeemed.name);
priorityGraph.connect(features.redemption.name, features.encryptShipping.name);
priorityGraph.connect(features.redemption.name, features.decryptShipping.name);

const semantic = new TesterantoGraphDirected("some semantic directed graph");
semantic.connect(features.hello.name, features.aloha.name, "superceedes");
semantic.connect(features.gutentag.name, features.hola.name, "negates");

const undirected = new TesterantoGraphUndirected("an undirected semantic graph");
undirected.connect(features.gutentag.name, features.aloha.name, "related");
undirected.connect(features.buildRocket.name, features.buildSatellite.name, "overlap");

export default new TesterantoFeatures([
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
  features.buildSatellite,
], {
  undirected: [undirected],
  directed: [semantic],
  dags: [priorityGraph]
}
);

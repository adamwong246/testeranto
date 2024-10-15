import {
  BaseFeature,
  TesterantoGraphDirectedAcyclic,
  TesterantoGraphDirected,
  TesterantoGraphUndirected,
  TesterantoFeatures
} from "testeranto/src/Features";

export class MyFeature extends BaseFeature {
  due?: Date;
  constructor(name: string, due?: Date) {
    super(name);
    this.due = due;
  }
}

export const features = {
  root: new MyFeature("kokomo bay!"),
  mint: new MyFeature("An ERC721 which is redeemable?!!!"),
  redemption: new MyFeature(
    "Redeems an ERC-721, marking its state as redeemed"
  ),
  federatedSplitContract: new MyFeature(
    "A website which can acts as a storefront"
  ),
  markRedeemed: new MyFeature(
    "Registers contract status as redeemed, and changes image"
  ),
  encryptShipping: new MyFeature(
    "Buyer encrypts plaintext message and stores value on contract"
  ),
  decryptShipping: new MyFeature("Vendor Decrypts plaintext message"),
  buildSilo: new MyFeature(
    "build the rocket silo",
    new Date("2023-05-02T02:36:34+0000")
  ),
  buildRocket: new MyFeature(
    "build the rocket",
    new Date("2023-06-06T02:36:34+0000")
  ),
  buildSatellite: new MyFeature(
    "build the rocket payload",
    new Date("2023-06-06T02:36:34+0000")
  ),
  hello: new MyFeature("hello"),
  aloha: new MyFeature("aloha"),
  gutentag: new MyFeature("gutentag"),
  buenosDias: new MyFeature("buenos dias"),
  hola: new MyFeature("hola"),
  bienVenidos: new MyFeature("bien venidos"),
  walkingTheDog: new MyFeature("my favorite chore"),
};

const priorityGraph = new TesterantoGraphDirectedAcyclic("Priority");

priorityGraph.connect(`root`, `redemption`);
priorityGraph.connect(`root`, `federatedSplitContract`);
priorityGraph.connect(`root`, `mint`);
priorityGraph.connect(`redemption`, `markRedeemed`);
priorityGraph.connect(`redemption`, `encryptShipping`);
priorityGraph.connect(`redemption`, `decryptShipping`);

const semantic = new TesterantoGraphDirected("some semantic directed graph");
semantic.connect(`hello`, `aloha`, "superceedes");
semantic.connect(`gutentag`, `hola`, "negates");

const undirected = new TesterantoGraphUndirected(
  "an undirected semantic graph"
);
undirected.connect(`gutenta`, `aloha`, "related");
undirected.connect(`buildRocket`, `buildSatellite`, "overlap");
undirected.connect(`buildRocket`, `buildSilo`, "overlap");

export default new TesterantoFeatures(features, {
  undirected: [undirected],
  directed: [semantic],
  dags: [priorityGraph],
});

import { BaseFeature, TesterantoFeatures } from "./Features";
export declare class MyFeature extends BaseFeature {
    due?: Date;
    constructor(name: string, due?: Date);
}
export declare const features: {
    root: MyFeature;
    mint: MyFeature;
    redemption: MyFeature;
    federatedSplitContract: MyFeature;
    markRedeemed: MyFeature;
    encryptShipping: MyFeature;
    decryptShipping: MyFeature;
    buildSilo: MyFeature;
    buildRocket: MyFeature;
    buildSatellite: MyFeature;
    hello: MyFeature;
    aloha: MyFeature;
    gutentag: MyFeature;
    buenosDias: MyFeature;
    hola: MyFeature;
    bienVenidos: MyFeature;
    walkingTheDog: MyFeature;
};
declare const _default: TesterantoFeatures;
export default _default;

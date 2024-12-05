import renderer from "react-test-renderer";
import { ISelection, IStore } from ".";
export declare const testInterface: {
    beforeEach: (CComponent: any, propsAndChildren: any) => Promise<renderer.ReactTestRenderer>;
    andWhen: (renderer: renderer.ReactTestRenderer, whenCB: any) => Promise<renderer.ReactTestRenderer>;
    butThen: (s: IStore, thenCB: any, tr: any) => Promise<ISelection>;
    afterEach: (store: IStore, ndx: any, artificer: any) => Promise<{}>;
    afterAll: (store: IStore, artificer: any) => void;
};

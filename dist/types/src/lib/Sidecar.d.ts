import { ITTestResourceConfiguration } from ".";
export declare abstract class Sidecar {
    abstract start(t: ITTestResourceConfiguration): any;
    abstract stop(): any;
}

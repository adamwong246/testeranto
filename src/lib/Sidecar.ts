import { ITTestResourceConfiguration } from ".";

export abstract class Sidecar {
  abstract start(t: ITTestResourceConfiguration);
  abstract stop();
}

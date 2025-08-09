import { ITTestResourceConfiguration } from ".";

// Do not add logging to this file as it is used by the pure runtime.

export abstract class Sidecar {
  abstract start(t: ITTestResourceConfiguration);
  abstract stop();
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DesignObject {
  type: string;
  [key: string]: any;
}

export interface Design {
  version: string;
  background: string;
  objects: DesignObject[];
}

export interface Collaborator {
  id: string;
  name: string;
}

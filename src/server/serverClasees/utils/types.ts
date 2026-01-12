// / WebSocket message types
export interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

export type IMetaFile = {
  errors: [];
  warnings: [];
  metafile: {
    inputs: Map<
      string,
      {
        bytes: number;
        format: string;
        imports: {
          path: string;
          kind: string;
          external?: boolean;
        }[];
      }
    >;
    outputs: Map<
      string,
      {
        bytes: number;
        entrypoint: string;
        exports: string[];
        inputs: Map<string, number>;
        imports: {
          path: string;
          kind: string;
          external?: boolean;
        }[];
      }
    >;
  };
};

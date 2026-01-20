import { IRunTime } from "../Types";

export type IMode = "once" | "dev";

export interface TestResource {
  name: string;
  ports: number[];
  fs: string;
  browserWSEndpoint?: string;
  [key: string]: any;
}

export interface TestServiceConfig {
  serviceName: string;
  runtime: IRunTime;
  entryPoint: string;
  testResource?: TestResource;
  env?: Record<string, string>;
}

export interface BuildServiceStatus {
  name: string;
  status: string;
}

export interface TestServiceInfo {
  config: TestServiceConfig;
  startTime: number;
  status: string;
}

export interface TcpConnection {
  socket: import("net").Socket;
  testInfo: {
    serviceName?: string;
  };
}

export interface DockerComposeOptions {
  cwd: string;
  config: string;
  log: boolean;
  commandOptions?: string[];
  env?: Record<string, string>;
}


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

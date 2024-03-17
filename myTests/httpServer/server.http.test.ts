import http from "http";

import { serverFactory } from "../../src/server";
import {
  IServerTestSpecifications, ServerTestImplementation, ServerTestSpecification
} from "../../src/server.test";

import { HttpTesteranto } from "./http.testeranto.test";

export const ServerHttpTesteranto = HttpTesteranto<
  IServerTestSpecifications,
  () => http.Server
>(
  serverFactory,
  ServerTestImplementation,
  ServerTestSpecification,
);

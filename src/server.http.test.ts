import { serverFactory } from "./server";
import {
  IServerTestSpecifications, ServerTestImplementation, ServerTestSpecification
} from "./server.test";

import { HttpTesteranto } from "../myTests/http.testeranto.test";

export const ServerHttpTesteranto = HttpTesteranto<
  IServerTestSpecifications
>(
  serverFactory,
  ServerTestImplementation,
  ServerTestSpecification,
);

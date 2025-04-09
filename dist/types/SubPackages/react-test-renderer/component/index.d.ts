import React from "react";
import { ReactTestRenderer } from "react-test-renderer";
import type { Ibdd_in } from "../../../Types";
export type IInput<P, S> = typeof React.Component<P, S>;
export type I = Ibdd_in<IInput<any, any>, ReactTestRenderer, ReactTestRenderer, ReactTestRenderer, unknown, unknown, (r: ReactTestRenderer) => ReactTestRenderer>;

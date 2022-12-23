// This file defines the test of a classical react component

import React from "react";
import renderer, { act, ReactTestRenderer } from "react-test-renderer";

import { TesterantoFactory } from "../../index";
import { ITestImplementation, ITestSpecification, ITTestShape } from "../../src/testShapes";
import { ClassicalComponent } from "./ClassicalComponent";

type Input = any;
type TestResource = "never";
type InitialState = unknown;
type WhenShape = any;
type ThenShape = any;

export const ReactTestRendererTesteranto = <
  ITestShape extends ITTestShape
>(
  testImplementations: ITestImplementation<
    InitialState,
    renderer.ReactTestRenderer,
    WhenShape,
    ThenShape,
    ITestShape
  >,
  testSpecifications: ITestSpecification<ITestShape>,
  testInput: Input
) =>
  TesterantoFactory<
    ITestShape,
    renderer.ReactTestRenderer,
    renderer.ReactTestRenderer,
    renderer.ReactTestRenderer,
    renderer.ReactTestRenderer,
    any,
    any,
    any,
    any
  >(
    testInput,
    testSpecifications,
    testImplementations,
    "na",
    async (input) => input,
    async (subject) => {
      let component;
      act(() => {
        component = renderer.create(
          React.createElement(ClassicalComponent, {}, [])
        );
      });
      return component;
    },
    // andWhen  
    async (renderer, actioner, testResource) => {
      await act(() => actioner(renderer));
      return renderer
    },
    // butThen
    async (component, callback, testResource) => {
      return component;
    },
    (t) => t,
    async (component, ndx) => component,
    (actioner) => actioner,
    
  )

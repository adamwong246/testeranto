import Rectangle from "./Rectangle";

export interface IRectangleTestShape {
  iinput: Rectangle;
  isubject: Rectangle;
  istore: Rectangle;
  iselection: Rectangle;

  when: (rectangle: Rectangle) => any;
  then: unknown;
  given: (x) => (y) => unknown;

  suites: {
    Default: [string];
  };
  givens: {
    Default;
    WidthOfOneAndHeightOfOne;
    WidthAndHeightOf: [number, number];
  };
  whens: {
    HeightIsPubliclySetTo: [number];
    WidthIsPubliclySetTo: [number];
    setWidth: [number];
    setHeight: [number];
  };
  thens: {
    AreaPlusCircumference: [number];
    circumference: [number];
    getWidth: [number];
    getHeight: [number];
    area: [number];
    prototype: [string];
  };
  checks: {
    Default;
    WidthOfOneAndHeightOfOne;
    WidthAndHeightOf: [number, number];
  };
}

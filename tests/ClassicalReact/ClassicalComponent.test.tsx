import assert from "assert";
import React from "react";
import {
  Suite as TSuite,
  Given as TGiven,
  When as TWhen,
  Then as TThen
} from "../../index";

type IClassicalComponentProps = { hello: string };
type IClassicalComponentState = { count: number };
class ClassicalComponent extends React.Component<IClassicalComponentProps, IClassicalComponentState> {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div>
        <p>{this.props.hello}</p>
        <p>count: {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click
        </button>
      </div>
    );
  }
}

const dummyProps0: IClassicalComponentProps = {
  hello: "aloha"
};
const dummyProps1: IClassicalComponentProps = {
  hello: "salutations"
};

const ClassicalComponentTesteranto = {
  Suite: {
    default: (
      description: string,
      classicalComponent: typeof ClassicalComponent,
      givens: any[]
    ) => new TSuite<typeof ClassicalComponent>(description, classicalComponent, givens)
  },
  Given: {
    Default: (
      feature: string,
      whens: TWhen<ClassicalComponent>[],
      thens: TThen<ClassicalComponent>[]
    ) => new TGiven(`default`, whens, thens, feature, new ClassicalComponent({}))
  },

  When: {
    SetTheProps: (props: IClassicalComponentProps) =>
      new TWhen<ClassicalComponent>(`Props check`, (classicalComponent: any) => {
        classicalComponent.props = props;
      }
      ),

  },

  Then: {
    ThePropsAre: (props: IClassicalComponentProps) =>
      new TThen(`the props are`, (classicalComponent: ClassicalComponent) =>
        assert.equal(classicalComponent.props, props)
      ),
    ThePropsAreNot: (props: IClassicalComponentProps) => {
      return new TThen(`the props are not`, (classicalComponent: ClassicalComponent) =>
        assert.notEqual(classicalComponent.props, props)
      )
    }
    ,
  },
}

const Given = ClassicalComponentTesteranto.Given;
const When = ClassicalComponentTesteranto.When;
const Then = ClassicalComponentTesteranto.Then;
const Suite = ClassicalComponentTesteranto.Suite.default;

export default () => {
  Suite(`testing the ClassicalComponent class`, (ClassicalComponent), [
    Given.Default(`Default`, [
      When.SetTheProps(dummyProps0),
    ], [
      Then.ThePropsAre(dummyProps0)
    ]),

    Given.Default(``, [
      When.SetTheProps(dummyProps0),
      When.SetTheProps(dummyProps1),
    ], [
      Then.ThePropsAre(dummyProps1),
      Then.ThePropsAreNot(dummyProps0)
    ]),

  ]).run();
}
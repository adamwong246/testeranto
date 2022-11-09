

// import { ReactTestRenderer, act } from "react-test-renderer";
import { TesterantoGiven, TesterantoSuite, TesterantoThen, TesterantoWhen } from "../..";
import type { ICardProps, ICard } from "./Card";
import { Card } from "./Card";

export class Suite<
  ICardProps,
  ICard,
> extends TesterantoSuite<ICardProps, ICard> {
}

class Given<
  ICardProps,
  ICard,
> extends TesterantoGiven<ICardProps, ICard> {

  initialValues: ICardProps;

  constructor(
    name: string,
    whens: When<ICardProps>[],
    thens: Then<ICard>[],
    feature: string,
    initialValues: any = {}

  ) {
    super(name, whens, thens, feature);
    this.initialValues = initialValues;
  }

  given(card: any) {
    return card;
  }


}

class When<ICardProps> extends TesterantoWhen<ICardProps> {

  actionCreator: (x: ICard) => any;
  payload: object;

  constructor(
    name: string,
    actionCreator: (x: ICardProps) => any,
    payload: any = {}
  ) {
    super(name, actionCreator, payload);
  }

  when(cardProps: ICardProps, action: any) {
    // throw new Error("Method not implemented.");
    return cardProps;
  }

};

class Then<ICard> extends TesterantoThen<ICard> {
  then(card: ICard) {
    return card;
  }
};

const Testeranto = {
  Suite: {
    default: (
      description: string,
      card: ICard,
      givens: any[]
    ) => new Suite(description, card, givens)
  },
  Given: {
    Default: (
      feature: string,
      whens: When<ICard>[],
      thens: Then<ICard>[]
    ) => new Given(
      `default`,
      whens, thens, feature,
      Card({ title: "", paragraph: "" })
      // { title: "", paragraph: "" }
      // () => Card({ title: "", paragraph: "" })
      // React.createElement(Card, { title: "", paragraph: "" }, [])
    )
  },

  When: {
    TheTitleIs: (title: string) =>
      new When<ICard>(`the title is set to "${title}"`, (card) => {
        console.log(card({ title: 'title', paragraph: 'paragraph' }));
      }),
  },

  Then: {
    TitleIs: (title: string) =>
      new Then(`the title is "${title}"`, (card: ICard) => {
        // console.log(card);
        // assert.equal(card.title, title)
      })

  }
};

// const CardSuite = CardTesteranto.Suite.default;
// const { Given, When, Then } = CardTesteranto;

export default () => {

  Testeranto.Suite.default(`testing the Card class`, (Card), [
    Testeranto.Given.Default(`default`, [
      Testeranto.When.TheTitleIs("hello"),
    ], [
      Testeranto.Then.TitleIs("hello"),
    ]),



  ]).run();
}


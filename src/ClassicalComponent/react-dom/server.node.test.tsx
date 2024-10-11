import test, {
  Stream,
  renderToStaticMarkup,
  renderToStaticNodeStream,
  ISubject,
  IStore,
  ISelection,
  IThenShape
} from "testeranto/src/SubPackages/react-dom/component/node";
import { ITestSpecification } from "testeranto/src/core";

import { assert } from "chai";

import { ClassicalComponent } from "..";

const snapshot = `<div style="border:3px solid green"><h1>Hello Marcus</h1><pre id="theProps">{}</pre><p>foo: </p><pre id="theState">{&quot;count&quot;:0}</pre><p>count: 0 times</p><button id="theButton">Click</button></div>`;
const readableStream = new ReadableStream({
  start(controller) {
    // The following function handles each data chunk
    function push() {
      controller.enqueue("idk");
      controller.close();
      // "done" is a Boolean and value a "Uint8Array"
      // reader.read().then(({ done, value }) => {
      //   // If there is no more data to read
      //   if (done) {
      //     console.log("done", done);
      //     controller.close();
      //     return;
      //   }
      //   // Get the data and send it to the browser via the controller
      //   controller.enqueue(value);
      //   // Check chunks by logging to the console
      //   console.log(done, value);
      //   push();
      // });
    }

    push();
  },
});
// readableStream.on("readable", () => {
//   console.log("readable")
// })
// readableStream.pipe(process.stdout)
// readableStream.push(snapshot);
// piping
// readableStream.pipe(process.stdout)

// // through the data event
// readableStream.on('data', (chunk) => {
//   console.log(chunk.toString());
// });

type IClassicalComponentSpec = {
  suites: {
    Default: string;
  };
  givens: {
    AnEmptyState: [];
  };
  whens: Record<string, never>;
  thens: {
    renderToStaticMarkup: [string];
    renderToStaticNodeStream: [NodeJS.ReadableStream];
  };
  checks: {
    AnEmptyState;
  };
}

const ClassicalComponentSpec: ITestSpecification<
  IClassicalComponentSpec,
  ISubject,
  IStore,
  ISelection,
  IThenShape
> =
  (Suite, Given, When, Then, Check) => {
    return [
      Suite.Default(
        "Classical Component, react-dom, server.node",
        {
          "test0": Given.AnEmptyState(
            ["test"],
            [],
            [
              Then.renderToStaticMarkup(snapshot),
              Then.renderToStaticNodeStream(readableStream)
            ]
          ),
        },
        []
      ),
    ];
  }

export default test(
  {
    suites: {
      Default: "some default Suite",
    },
    givens: {
      AnEmptyState: () => () => {
        return { props: { foo: "bar" } };
      },
    },
    whens: {},
    thens: {
      renderToStaticMarkup:
        (expectation) =>
          async (reactNodes) => {
            assert.deepEqual(
              renderToStaticMarkup(reactNodes),
              expectation
            );
          },

      renderToStaticNodeStream:
        (expectation) =>
          async (reactNodes) => {
            // console.log((renderToStaticNodeStream(reactNodes)))
            // assert.deepEqual(
            //   (renderToStaticNodeStream(reactNodes).read().toString()),
            //   expectation.toString()
            // );

          }
    },
    checks: {
      AnEmptyState: () => () => {
        return {};
      },
    },
  },
  ClassicalComponentSpec,
  ClassicalComponent,
);

import { assert } from "chai";
import http from "http";

import {TesterantoFactory} from "../../index";
import { ITestImplementation, ITestSpecification, ITTestShape } from "../../src/testShapes";

type TestResource = "port";
type WhenShape = [url: string, paylaod: string];
type ThenShape = any;
type Input = () => http.Server;
type Subject = () => http.Server;
type InitialState = unknown;
type Store = http.Server;
type Selection = string;

export const HttpTesteranto = <
  ITestShape extends ITTestShape
>(
  testImplementations: ITestImplementation<
    InitialState,
    Selection,
    WhenShape,
    ThenShape,
    ITestShape
  >,
  testSpecifications: ITestSpecification<ITestShape>,
  testInput: Input
) =>
  TesterantoFactory<
    ITestShape,
    Input,
    Subject,
    Store,
    Selection,
    ThenShape,
    WhenShape,
    TestResource,
    InitialState
  >(
    testInput,
    testSpecifications,
    testImplementations,
    (input) => input,
    async (serverFactory, initialValues, testResource) => {
      const server = serverFactory();
      console.log("server starting...")
      await server.listen(testResource);
      return server;
    },
    
    // andWhen  
    async (store, actioner, testResource) => {
      const [path, body]: [string, string] = actioner(store)();
      const y = await fetch(
        `http://localhost:${testResource.toString()}/${path}`,
        {
          method: "POST",
          body,
        }
      );

      return await y.text();
    },
    // butThen
    async (store, callback, testResource) => {
      const [path, expectation]: [string, string] = callback({});
      const bodytext = await (
        await fetch(`http://localhost:${testResource.toString()}/${path}`)
      ).text();
      assert.equal(bodytext, expectation);
      return bodytext;
      // const [path, expectation]: [string, string] = callback({});

      // return new Promise((res) => {
      //   fetch(`http://localhost:${testResource.toString()}/${path}`).then((response) => {
      //     return response.text()
      //   }).then((bodytext) => {
      //     res(assert.equal(bodytext, expectation));
      //   })
      // });

      
      // const bodytext = await(
      //   await fetch(`http://localhost:${testResource.toString()}/${path}`)
      // ).text();
      // assert.equal(bodytext, expectation);
      // return bodytext;
    },
    // async (store, callback, testResource) => {
    //   const [path, expectation]: [string, string] = callback({});
    //   const bodytext = await(
    //     await fetch(`http://localhost:${testResource.toString()}/${path}`)
    //   ).text();
    //   assert.equal(bodytext, expectation);
    //   return bodytext;
    // },

    
    (t) => t,
    async (server) => {
      await server.close();
      return server;
    },
    (actioner) => {
      console.log("mark1", actioner.toString())
      return actioner

    },
    "port"
  )
  
// export class HttpTesteranto<
//   IStoreShape,
//   ITestShape extends ITTestShape
// > extends Testeranto<
//   ITestShape,
//   IStoreShape,
//   IStoreShape,
//   IStoreShape,
//   IStoreShape,
//   IWhenShape,
//   IThenShape,
//   ITestResource,
//   IInput
// > {
//   constructor(
//     testImplementation: ITestImplementation<
//       IStoreShape,
//       IStoreShape,
//       IWhenShape,
//       IThenShape,
//       ITestShape
//     >,
//     testSpecification: ITestSpecification<ITestShape>,
//     thing
//   ) {
//     super(
//       testImplementation,
//       /* @ts-ignore:next-line */
//       testSpecification,
      
//       thing,
//       class Suite extends BaseSuite<IInput, any, any, any, any> { },

//       class Given extends BaseGiven<any, any, any, any> {
//           async teardown(server: http.Server, ndx) {
//             return new Promise<void>((resolve) => {
//               server.close(() => {
//                 resolve();
//               });
//             });
//           }

//           async givenThat(subject, port: number) {
//             const server = serverFactory();
//             await server.listen(port);
//             return server;
//           }
//       },
      
//       class When<IStore> extends BaseWhen<IStore, any, any> {
//         payload?: any;

//         constructor(name: string, actioner: (...any) => any, payload?: any) {
//           super(name, (store) => actioner(store));
//           this.payload = payload;
//         }

//         async andWhen(store, actioner, port: number) {
//           const [path, body]: [string, string] = actioner({});
//           const y = await fetch(
//             `http://localhost:${port.toString()}/${path}`,
//             {
//               method: "POST",
//               body,
//             }
//           );

//           return y.text();
//         }
//       },

//       class Then extends BaseThen<any, any, any> {
//         constructor(name: string, callback: (val: any) => any) {
//           super(name, callback);
//         }

//         async butThen(store, port: number) {
//           const [path, expectation]: [string, string] = this.thenCB({});
//           const bodytext = await (
//             await fetch(`http://localhost:${port.toString()}/${path}`)
//           ).text();
//           assert.equal(bodytext, expectation);
//           return;
//         }
//       },

//       class Check extends BaseCheck<any, any, any, IThenShape> {
//         async teardown(server: http.Server) {
//           return new Promise((resolve, reject) => {
//             server.close(() => {
//               resolve(server);
//             });
//           });
//         }

//         async checkThat(subject, port: number) {
//           const server = serverFactory();
//           await server.listen(port);
//           return server;
//         }
//       },
      
//       "port"
//     );
//   }
// }

import renderer, { act } from "react-test-renderer";
// export const testInterface = {
//   beforeEach: function (CComponent, props): Promise<renderer.ReactTestRenderer> {
//     return new Promise((res, rej) => {
//       let component: renderer.ReactTestRenderer;
//       act(() => {
//         component = renderer.create(
//           CComponent(props)
//         );
//         res(component);
//       });
//     });
//   },
//   andWhen: async function (
//     renderer: renderer.ReactTestRenderer,
//     actioner: () => (any) => any
//   ): Promise<renderer.ReactTestRenderer> {
//     await act(() => actioner()(renderer));
//     return renderer
//   }
// }
export const testInterface = {
    beforeEach: function (CComponent, props) {
        return new Promise((res, rej) => {
            act(() => {
                const x = renderer.create(new CComponent(props));
                console.log("beforeEach", x.getInstance());
                res(x);
            });
        });
    },
    andWhen: async function (renderer, actioner) {
        // console.log("andWhen", renderer)
        await act(() => actioner()(renderer));
        return renderer;
    },
    // andWhen: function (s: Store, actioner): Promise<Selection> {
    //   return actioner()(s);
    // },
    butThen: async function (s) {
        // console.log("butThen", s)
        return s;
    },
    afterEach: async function (store, ndx, artificer) {
        // console.log("afterEach", store);
        return {};
    },
    afterAll: (store, artificer) => {
        // console.log("afterAll", store);
        return;
    },
};

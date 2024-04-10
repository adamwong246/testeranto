import renderer, { act } from "react-test-renderer";
export const testInterface = {
    beforeEach: async (CComponent) => {
        return new Promise((res, rej) => {
            let component;
            act(async () => {
                component = renderer.create(CComponent);
            });
            res(component);
        });
    },
    andWhen: async function (renderer, whenCB) {
        await act(() => whenCB()(renderer));
        return renderer;
    }
};

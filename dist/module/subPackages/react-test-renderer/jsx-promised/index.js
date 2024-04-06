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
    andWhen: async function (renderer, actioner) {
        await act(() => actioner()(renderer));
        return renderer;
    }
};

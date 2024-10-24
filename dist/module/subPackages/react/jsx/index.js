export const testInterface = {
    beforeEach: async (x, ndx, testRsource, artificer) => {
        return new Promise((resolve, rej) => {
            resolve(x());
        });
    },
    andWhen: function (s, whenCB) {
        return whenCB(s);
    },
};

export const testInterface = (testInput) => {
    return {
        beforeEach: async (x, ndx, testRsource, artificer) => {
            return new Promise((resolve, rej) => {
                resolve(testInput());
            });
        },
        andWhen: function (s, actioner) {
            return actioner()(s);
        },
    };
};

export const testInterface = (testInput) => {
    return {
        beforeEach: async (x, ndx, testRsource, artificer) => {
            return new Promise((resolve, rej) => {
                resolve(testInput());
            });
        },
        andWhen: function (s, whenCB) {
            // console.log("mark18")
            // debugger
            return whenCB(s);
        },
    };
};

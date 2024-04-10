"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testInterface = void 0;
// const TesterantoComponent = (testInput) => (props) => {
//   const myContainer = useRef(null);
//   useEffect(() => {
//     console.log(
//       "useeffectCalled"
//     );
//     props.done(myContainer.current);
//   }, []);
//   return React.createElement('div', { ref: myContainer }, testInput());  //testInput();
// };
const testInterface = (testInput) => {
    return {
        beforeEach: async (x, ndx, testRsource, artificer) => {
            return new Promise((resolve, rej) => {
                resolve(testInput());
            });
        },
        andWhen: function (s, whenCB) {
            return whenCB()(s);
        },
    };
};
exports.testInterface = testInterface;

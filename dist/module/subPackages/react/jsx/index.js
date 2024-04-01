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

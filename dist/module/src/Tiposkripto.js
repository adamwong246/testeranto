import { defaultTestResourceRequirement } from "./lib";
let tpskrt;
// Use esbuild define to distinguish environments
// declare const TESTERANTO_RUNTIME: "node" | "web" = "node";
if (process.env["TESTERANTO_RUNTIME"] === "node") {
    tpskrt = await import("./lib/Node");
}
else if (process.env["TESTERANTO_RUNTIME"] === "web") {
    tpskrt = await import("./lib/Web");
}
else {
    throw `Unknown ENV ${process.env["TESTERANTO_RUNTIME"]}`;
}
// console.log(
//   "Hello universal Tiposkripto!",
//   process.env["TESTERANTO_RUNTIME"],
//   tpskrt
// );
// async function ttt<I extends Ibdd_in_any, O extends Ibdd_out_any, M>(): Promise<
//   Tiposkripto<I, O, M>
// > {
//   return await tpskrt.default;
// }
export default async (input, testSpecification, testImplementation, testAdapter, testResourceRequirement = defaultTestResourceRequirement) => {
    console.log("mark100", await tpskrt.default.toString());
    return (await tpskrt.default)(input, testSpecification, testImplementation, testResourceRequirement, testAdapter);
};

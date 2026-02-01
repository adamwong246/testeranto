const fs = await import('fs/promises');
import { Server } from "./server/serverClasees/Server";
const mode = process.argv[3];
if (mode !== "once" && mode !== "dev") {
    console.error(`The 3rd argument should be 'dev' or 'once', not '${mode}'.`);
    process.exit(-1);
}
const main = async () => {
    const config = (await import(process.cwd() + '/testeranto/testeranto.ts')).default;
    await new Server(config, mode).start();
};
main();

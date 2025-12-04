import ansiC from "ansi-colors";
export function setupKeypressHandling() {
    process.stdin.on("keypress", (str, key) => {
        if (key.name === "x") {
            console.log(ansiC.inverse("Shutting down forcefully..."));
            process.exit(-1);
        }
        if (key.name === "q") {
            console.log("Testeranto is shutting down gracefully...");
            // Note: TesterantoDocker instance would need to be accessible here
            // For now, we'll exit, but in the full implementation, we need to stop TesterantoDocker
            process.exit(0);
        }
    });
}

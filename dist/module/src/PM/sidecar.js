export class PM_sidecar {
    testArtiFactoryfileWriter(tLog, callback) {
        return (fPath, value) => {
            callback(Promise.resolve());
        };
    }
}

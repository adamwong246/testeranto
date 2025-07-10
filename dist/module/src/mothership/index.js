import express from "express";
const app = express();
app.get("/", (req, res) => {
    res.send("Hello World!");
});
export default (port) => {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
    return app;
};

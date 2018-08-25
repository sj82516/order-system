const express = require("express");
const path = require("path");
require("express-async-errors");
const router = require("./app/router");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const errorHandler = require("./app/helper/middleware/errorHandler").errorHandler;

const conf = require("./conf.json")

const app = express();
const port = conf.port || 3000;

app.use(bodyParser.json());
app.use(helmet());
app.use("/api", router);
app.use(errorHandler);
app.use("/dist", express.static(path.join(__dirname, './app/static/dist')))
app.use("*", function (req, res) {
    return res.sendFile(path.join(__dirname, './app/static/dist/index.html'));
});

app.listen(port, () => {
    console.log(`server listen at ${port}`)
})
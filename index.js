const express = require("express");
const path = require("path");
require("express-async-errors");
const router = require("./app/router");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const errorHandler = require("./app/helper/middleware/errorHandler").errorHandler

const app = express();
const port = 3001

app.use(bodyParser.json());
app.use(helmet());
app.use("/api", router);
app.use(errorHandler);
app.use(express.static(path.join(__dirname, './app/static/')))
app.use("*", function (req, res) {
    return res.sendFile(path.join(__dirname, './app/static/index.html'));
});

app.listen(port, () => {
    console.log(`server listen at ${port}`)
})
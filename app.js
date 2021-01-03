const morgan = require("morgan");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

mongoose.connect("mongodb+srv://" + process.env.login + ":"+ process.env.passwd +"@api.kqtsm.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {useNewUrlParser: true, useUnifiedTopology: true}
);

app.use(morgan("combined"));
app.use(cors());
app.use(bodyParser.json());

app.use((req,res,next) => {
    const error = new Error("Błąd wyszukiwania");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message,
        },
    });
});

module.exports = app;
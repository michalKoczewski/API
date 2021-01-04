const morgan = require("morgan");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

mongoose.connect("mongodb+srv://" + process.env.MONGO_DB_LOGIN + ":"+ process.env.MONGO_DB_PASSWD +"@api.kqtsm.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {useNewUrlParser: true, useUnifiedTopology: true}
);
mongoose.set('useCreateIndex', true);

app.use("/uploads", express.static("uploads"));
app.use(morgan("combined"));
app.use(bodyParser.json());

const postRoutes = require("./api/routes/posts");
const userRoutes = require("./api/routes/users");

app.use("/posts", postRoutes);
app.use("/users", userRoutes);

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
const { Mongoose } = require("mongoose")

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    userName: {type: String},
    userPasswd: {type: String},
    createDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model("User", userSchema);
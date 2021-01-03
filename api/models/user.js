const { Mongoose } = require("mongoose")

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    userName: {type: String,unique: true ,required: true},
    userPasswd: {type: String,required: true },
    createDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model("User", userSchema);
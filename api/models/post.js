const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    postName: {type: String, required: true},
    postDescription: {type: String, required: false},
    img: {type: String, required: false}
})

module.exports = mongoose.model("Post", postSchema);
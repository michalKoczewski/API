const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    comment: {type: String}
});

const postSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    postName: {type: String},
    postDescription: {type: String},
    img: {type: String}
})

module.exports = mongoose.model("Post", postSchema);
const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    comment: {type: String}
});

const postSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    postName: {type: String, required: true},
    postDescription: {type: String, required: false},
    img: {type: String, required: false},
    comment: {type: commentSchema}
})

module.exports = mongoose.model("Post", postSchema);
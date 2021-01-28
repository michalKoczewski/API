const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const router = express.Router();

const Post = require("../models/post");

const storage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(":","").replace(":","") + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5},
    fileFilter: fileFilter,  
});

router.post('/', upload.single("img"), (req,res,next) => {
    const post = new Post({
        _id: new mongoose.Types.ObjectId(),
        postName: req.body.postName,
        postDescription: req.body.postDescription,
        img: req.file.path
    });
    post.save()
    .then(doc => {
        res.status(201).json({
            message: "New post added",
            info: doc
        });
    })
    .catch(err => res.status(500).json({error: err}));
});

router.get('/', (req,res,next) => {
    Post.find()
    .then(doc => {
        res.status(201).json({
            posts: doc
        });
    })
    .catch(err => res.status(500).json({error: err}));
});

router.delete('/:postId', (req,res,next) => {
    const id = req.params.postId;
    Post.findByIdAndDelete(id)
    .then(doc => {
        res.status(200).json({
            message: "Post deleted, id: " + id,
            info: doc
        })
    })
    .catch(err => res.status(500).json({error: err}));
});

router.get('/:postId', (req,res,next) => {
    const id = req.params.postId;
    Post.findById(id)
    .then(doc => {
        res.status(201).json({
            post: doc
        });
    })
    .catch(err => res.status(500).json({error: err}));
});

router.patch('/postId', (req,res,next) => {
    const id = req.params.postId;
    Post.findByIdAndUpdate(id, {
        postName: req.body.postName,
        postDescription: req.body.postDescription,
        img: req.file.path,
        comment: req.body.comment
    }).
    then(doc => {
        res.status(200).json({
            message: "post updated, id: " + id,
            info: doc
        });
    })
    .catch(err => res.status(500).json({error: err}));
});

module.exports = router;
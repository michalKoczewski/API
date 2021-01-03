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
        postName: req.body.name,
        postDescription: req.body.price,
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
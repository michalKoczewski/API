const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");


router.post('/', (req,res,next) => {
    bcrypt.hash(req.body.userPasswd, 10, (err, hash) => {
        if(err) {
            return res.status(500).json({error: err});
        } else {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                userName: req.body.userName,
                userPasswd: hash,
            })
            user.save()
            .then(doc => {
                res.status(200).json({
                    message: "User created successfully",
                    info: doc
                })
            })
            .catch(err => res.status(500).json({error: err}));
        }
    })
});

router.get('/', (req,res,next) => {
    User.find()
    .then(doc => {
        res.status(200).json({
            message: "List of all users",
            info: doc
        });
    })
    .catch(err => res.status(500).json({error: err}));
});

router.get('/:userId', (req,res,next) => {
    const id = req.params.userId;
    User.findById(id)
    .then(doc => {
        res.status(200).json({
            wiadomosc: "User, id: " + id,
            info: doc
        })
    })
    .catch(err => res.status(500).json({error: err}));
});

router.delete('/:userId', (req,res,next) => {
    const id = req.params.userId;
    User.findByIdAndDelete(id)
    .then(doc => {
        res.status(200).json({
            wiadomosc: "Deleted user, id: " + id,
            info: doc
        })
    })
    .catch(err => res.status(500).json({error: err}));
});

module.exports = router;
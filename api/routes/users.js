const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const {check, validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");



router.post('/signup', [
        check("userName","Please Enter a Valid Username")
        .not()
        .isEmpty(),
        check("userPasswd", "Password must have length between 6 and 12").isLength({min: 6,max: 12})
    ],
    (req,res,next) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        res.status(400).json({
            error: errors
        });
    }

    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        userName: req.body.userName,
        userPasswd: req.body.userPasswd
    });
    if(User.find(user.userName)) {
    user.save()
    .then(doc => {
        res.status(200).json({
            message: "New user added",
            info: doc
        })
    })
    .catch(err => res.status(500).json({error: err}))
    } else { 
        res.status(500).json({message: "Username unavailable"});
    }
});

router.post('/signin', [
    check("userName","Please Enter a Valid Username")
    .not()
    .isEmpty(),
    check("userPasswd", "Password must have length between 6 and 12").isLength({min: 6,max: 12})
], (req,res,next) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        res.status(400).json({
            error: errors
        });
    }

    const { userName, userPasswd } = req.body;

    const user = User.findOne({userName});

    if(!user) {
        res.status(400).json({
            message: "User not exist"
        });
    }

    const isMatch = bcrypt.compare(userPasswd, user.userPasswd);

    if(!isMatch) {
        res.status(400).json({
            message: "Incorrect Password !"
        })
    }
    
    const payload = {
        user: {
            id: user._id
        }
    }

    jwt.sign(
        payload,
        process.env.TOKEN_SECRET,
        {
          expiresIn: 3600
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token
          });
        }
      );
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

router.patch('/:userId', (req,res,next) => {
    const id = req.params.userId;
    User.findByIdAndUpdate(id)
    .then(doc => {
        res.status(200).json({
            message: "User has been updated, id: " + id,
            info: doc
        });
    })
    .catch(err => res.status(500).json({error: err}));
});

module.exports = router;
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const {check, validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

router.post('/signUp', [
    check("userName", "Please enter a valid username").not().isEmpty(),
    check("userPasswd", "Please enter a valid password").isLength({
        min: 6,
        max: 12
    })
],

async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const { userName, userPasswd } = req.body;

    let user = await User.findOne({
        userName
    });
    if (user) {
    return res.status(400).json({
        message: "User already exists"
        });
    }

    user = new User({
        _id: new mongoose.Types.ObjectId(),
        userName: req.body.userName,
        userPasswd: req.body.userPasswd
    });

    const salt = await bcrypt.genSalt(10);
    user.userPasswd = await bcrypt.hash(userPasswd, salt);

    await user.save();
});

router.post('/signIn', [
    check("userName", "Please enter a valid username").not().isEmpty(),
    check("userPasswd", "Please enter a valid password").isLength({
        min: 6,
        max: 12
    })
],
async (req,res,next) =>{
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(410).json({
            errors: errors.array()
        });
    }

    const {userName, userPasswd} = req.body;

    const user = await User.findOne({userName});

    if(!user)
        return res.status(404).json({
            message: "User not exist"
        });

    const isMatch = await bcrypt.compare(userPasswd ,user.userPasswd);

    if(!isMatch) {
        return res.status(405).json({
            message: "Incorrect Password"
        });

    } else { 

        const payload = {
            user: {
                id: user._id
            }
        };

        jwt.sign(
            payload
            , process.env.TOKEN_SECRET,
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
    }    
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
    .catch(err => res.status(420).json({error: err}));
});

router.patch('/:userId', (req,res,next) => {
    const id = req.params.userId;   

    const salt =  bcrypt.genSalt(10);
    req.body.userPasswd = bcrypt.hash(userPasswd, salt);

    User.findByIdAndUpdate(id, {
        userName: req.body.userName,
        userPasswd: req.body.userPasswd
    })
    .then(doc => {
        res.status(200).json({
            message: "User has been updated, id: " + id,
            info: doc
        });
    })
    .catch(err => res.status(500).json({error: err}));
});

module.exports = router;
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const User = require('../models/userModel');
const Pass = require('../models/passModel');

router.post('/register', (req, res, next) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password 
    });

    User.addUser(newUser, (err, user) => {
        if(err){
            res.json({success: false, msg: "Failed to register user."});
        } else {
            res.json({success: true, msg: "User registered."});
        }
    })
});

router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg: 'Username is incorrect'});
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign(JSON.parse(JSON.stringify(user)), config.secret, {
                    expiresIn: 604800
                });
                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            } else {
                return res.json({success: false, msg: 'Password is incorrect'});
            }
        });
    });
});

router.post('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    let user = req.user;
    res.json({
        status: 'Logged in',
        user: {
            name: user.name,
            username: user.username,
            email: user.email
        }
    });
});

router.get('/dashboard', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    let user = req.user;
    Pass.getUserPasswords(user.username, (err, passwords) => {
        res.json(passwords);
    });
});

router.post('/savepass', passport.authenticate('jwt', {session: false}), (req, res, next) =>{
    let user = req.user;
    const newPass = new Pass({
        user: user.username,
        service: req.body.service,
        servicePassword: req.body.servicePassword
    });

    Pass.addServicePassword(newPass, (err, pass) => {
        if(err){
            res.json({success: false, msg:'Failed to add new password'});
        } else {
            res.json({success: true, msg:'New service password saved.'});
        }
    });
});

module.exports = router;
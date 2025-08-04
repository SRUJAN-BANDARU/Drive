const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require("../models/user.model");


router.get("/test", (req, res) =>{
    res.send("Testing route");
})


router.get('/register',(req, res) =>{
    res.render('../views/register')
})


router.post('/register',
    body('email').trim().isEmail().isLength({min : 13}),
    body('password').trim().isLength({min : 5}),
    body('username').trim().isLength({min : 3}),
    async (req, res) =>{

        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors : errors.array(),
                message : 'Invalid Data'
            })
        }
        
        const {username, email, password} = req.body;

        const hashedPass = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            username : username,
            email : email,
            password : hashedPass
        })
        res.json(newUser);
})

router.get('/login', (req, res) =>{
    res.render('login');
})

router.post('/login', 
    body('email').trim().isEmail().isLength({min : 13}),
    body('password').trim().isLength({min : 5})
    ,
    async(req, res) =>{
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors : errors.array(),
                message : "Invalid Data"
            })
        }

        const {email, password} = req.body;

        const user = await userModel.findOne({
            email : email
        })

        if(!user){
            return res.status(400).json({
                message : 'Username or password is incorrect'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if(!isMatch){
            return res.status(400).json({
                message : "Username or password is incorrect"
            })
        }

        const token = jwt.sign({
            userId : user._id,
            username : user.username,
            email : user.email
        },
            process.env.JWT_SECRET,
        )

        res.cookie('token', token);

        res.send("Logged In");
    }
)



module.exports = router;
const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');


router.get("/test", (req, res) =>{
    res.send("Testing route");
})

/*
    email
        'a@a.com'
        '    '
*/

router.get('/register',(req, res) =>{
    res.render('../views/register')
})


router.post('/register',
    body('email').trim().isEmail().isLength({min : 13}),
    body('password').trim().isLength({min : 5}),
    body('username').trim().isLength({min : 3}),
    (req, res) =>{

        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors : errors.array(),
                message : 'Invalid Data'
            })
        }
        
        res.send("User Registered Successfully");
})

module.exports = router;
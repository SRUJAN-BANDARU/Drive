const express = require("express");

const router = express.Router();


router.get("/test", (req, res) =>{
    res.send("Testing route");
})

router.get('/register', (req, res) =>{
    res.render('../views/register')
})

router.post('/register', (req, res) =>{
    console.log(req.body);
    res.send("User Registered Successfully");
})

module.exports = router;
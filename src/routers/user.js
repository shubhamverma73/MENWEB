const express   = require('express');
var url         = require('url');
const bcrypt    = require('bcrypt');
const router    = new express.Router();
const Users     = require('./../models/users');
const commonhelper = require('./../helper/commonhelper');
const auth = require("../middleware/auth");

router.get('/', (req, res) => {
    var queryString = url.parse(req.url, true);
    res.render('index', {
        post: {
            index: true
        }
    });
});

router.get('/login', (req, res) => {
    var queryString = url.parse(req.url, true);
    res.render('login', {
        post: {
            login: true
        }
    });
});

router.get('/register', (req, res) => {
    var queryString = url.parse(req.url, true);
    res.render('register', {
        post: {
            register: true
        }
    });
});

router.get('/secure', auth, (req, res) => {
    res.render('secure', {
        post: {
            secure: true
        }
    });
});

router.get('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((currentElement) => {
            return currentElement.token !== req.token //Return all tokens except current token
        });
        res.clearCookie("jwt");
        await req.user.save(); // save all tokens again into same document 
        res.status(200).render('index', { msg: "Logout successfully.", post: { index: true } });
    }
    catch(err) {
        commonhelper.handleError(err, res, '');
    }
});

router.get('/logout_all', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        res.clearCookie("jwt");
        await req.user.save(); // save all tokens again into same document 
        res.status(200).render('index', { msg: "Logout successfully.", post: { index: true } });
    }
    catch(err) {
        commonhelper.handleError(err, res, '');
    }
});

// ================================ Create a new user (Using Async Await) ===============================
router.post('/register', async (req, res) => {
    try {
        const password          = req.body.password;
        const confirmpassword   = req.body.confirmpassword;

        if(password === confirmpassword) {
            const register = new Users({
                name:       req.body.name,
                email:      req.body.email,
                phone:      req.body.phone,
                password:   req.body.password,
                gender:     req.body.gender,
            });

            const token     = await register.generateAuthToken(); // Calling Middleware function

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 60000), //60 sec.
                httpOnly: true
            });

            const result    = await register.save();

            res.status(201).render('index');
        } else {
            res.status(400).render('register', { msg: "Confirm password not matched with password.", post: { register: true } });
        }
    }
    catch(err) {
        commonhelper.handleError(err, res, '');
    }
});

// ================================ Get data of specific user ===============================
router.post('/login', async (req, res) => {
    try {
        const email             = req.body.email; //Perhaps req.query.email will be for GET method
        const password          = req.body.password;

        const result    = await Users.findOne({email: email}); //If you want to get by Phone or Email, use find instead of findById and replace _id with phone or email
        
        const isMatch   = await bcrypt.compare(password, result.password); //Confirm hash password with user input password

        const token     = await result.generateAuthToken(); // Calling Middlewear function
        
        if(isMatch) {

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 60000), //60 sec.
                httpOnly: true
            });

            //res.status(201).render('index', { data: result, post: { index: true } });
            res.status(201).redirect('/');
        } else {
            res.status(500).render('login', { msg: "Invalid credentials, please try again.", post: { login: true } });
        }
    }
    catch(err) {
        res.status(500).render('login', { msg: "Records not found, try again.", post: { login: true } });
    }
});

module.exports = router;
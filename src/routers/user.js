const express   = require('express');
var url         = require('url');
const router    = new express.Router();
const Users     = require('./../models/users');
const commonhelper = require('./../helper/commonhelper');

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

router.get('/error', (req, res) => {
    res.render('error');
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
            const result = await register.save();
            //commonhelper.handleSuccess(req, res, 'User registered successfully.');
            res.status(201).render('index');
        } else {
            commonhelper.handleError(err, res, 'Confirm password not matched with password.');
        }
    }
    catch(err) {
        commonhelper.handleError(err, res, '');
    }
});

// ================================ Get data of specific user ===============================
router.post('/login', async (req, res) => {
    try {
        const email             = req.body.email;
        const password          = req.body.password;

        const result = await Users.findOne({email: email}); //If you want to get by Phone or Email, use find instead of findById and replace _id with phone or email
        if(result.password === password) {
            res.status(201).render('index', { data: result });
        } else {
            res.status(500).render('login', { msg: "Invalid credentials, please try again.", post: { login: true } });
        }
    }
    catch(err) {
        res.status(500).render('login', { msg: "Records not found, try again.", post: { login: true } });
    }
});

module.exports = router;
const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');
const router = express.Router();

/* GET users listing (Only for Admins) */
router.get('/', authenticate.verifyUser, (req, res, next) => {
    if (req.user.admin) {
        User.find()
            .then(users => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(users);
            })
            .catch(err => next(err));
    } else {
        res.statusCode = 403;
        res.json({ error: 'Forbidden: Admin access only' });
    }
});

/* SIGNUP */
router.post('/signup', (req, res) => {
    const user = new User({
        email: req.body.email,
        name: req.body.name,
        bio: req.body.bio,
        graduationYear: req.body.graduationYear,
        course: req.body.course
    });

    User.register(user, req.body.password, (err, registeredUser) => {
        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');

            if (err.name === 'UserExistsError') {
                res.statusCode = 409; // Conflict
                return res.json({ success: false, message: 'A user with that email already exists.' });
            }

            return res.json({ success: false, err: err });
        }

        passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, status: 'Registration Successful!' });
        });
    });
});




/* LOGIN */
router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    const token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({
        success: true,
        token: token,
        status: 'You are successfully logged in!'
    });
});

/* LOGOUT */
router.get('/logout', (req, res) => {
    // With JWT, logout is handled on the client by deleting the token
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({
        success: true,
        status: 'Logout successful. Please delete your token on the client.'
    });
});

module.exports = router;

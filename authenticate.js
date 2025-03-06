const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const config = require('./config.js');

// ✅ Local Strategy for handling email/password login
exports.local = passport.use(
    new LocalStrategy(
        { usernameField: 'email' }, // ✅ Tell Passport to use 'email'
        User.authenticate()
    )
);

// Function to generate JWT tokens
exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, { expiresIn: 3600 }); // Token valid for 1 hour
};

// JWT Strategy options
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secretKey
};

// JWT Strategy to validate the token
exports.jwtPassport = passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        console.log('JWT payload:', jwt_payload);
        User.findById(jwt_payload._id)
            .then(user => {
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            })
            .catch(err => done(err, false));
    })
);

// Middleware to protect routes (ensures valid JWT)
exports.verifyUser = passport.authenticate('jwt', { session: false });

// Middleware to check if the user is an admin
exports.verifyAdmin = (req, res, next) => {
    if (req.user && req.user.admin) {
        return next();
    } else {
        const err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        return next(err);
    }
};

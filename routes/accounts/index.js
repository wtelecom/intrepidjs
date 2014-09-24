/**
 * Accounts routes.
 */

var passport = require("passport");
var rek = require('rekuire');
var signupPassport = rek('middlewares/users/signup_user');

module.exports = {
    '/accounts/signup': [
        {
            methods: ['get'],
            fn: function(req, res, next) {
                res.render('accounts/signup');
            }
        },
        {
            methods: ['post'],
            fn: function(req, res, next) {
                signupPassport(req, res);
            }
        }
    ],

    '/accounts/login': [
        {
            methods: ['get'],
            fn: function(req, res, next) {
                res.render('accounts/login');
            }
        },
        {
            methods: ['post'],
            fn: function(req, res, next) {
                passport.authenticate('local', function(err, user, info) {
                    if (err) { return next(err); }
                    if (!user) { return res.send({success: false}); }
                    req.logIn(user, function(err) {
                        if (err) { return next(err); }
                        return res.send({success: true});
                    });
                })(req, res, next);
            }
        }
    ],

    '/accounts/logout': [
        {
            methods: ['get'],
            fn: function(req, res, next) {
                req.logout();
                res.send({success: true});
            }
        }
    ]
};
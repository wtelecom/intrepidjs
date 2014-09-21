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
            fn: passport.authenticate('local', {
                successRedirect: '/',
                failureRedirect: '/accounts/login',
                failureFlash: true
            })
        }
    ],

    '/accounts/logout': [
        {
            methods: ['get'],
            fn: function(req, res, next) {
                req.logout();
                res.redirect('/');
            }
        }
    ]
};
/**
 * @file custom_data.js
 * @namespace Custom Data
 * @desc This module loads csutom data available in views
 */

module.exports = function(app) {
    app.use(function(req, res, next) {
        // Setting user info
        res.locals.user = req.user;

        // Setting underscore
        res.locals._ = require("underscore");

        // Retro-compatibility with flash method (ExpressJS 3.XX)
        // req.flash = function(type, msg) {
        //     console.log(msg);
        // };

        next();
    });
};
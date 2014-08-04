/**
 * @file request_engine.js
 * @namespace Request Engine
 * @desc This module manage basic requests
 */

var request = require('superagent'),
    _ = require('underscore');


exports.get = function(url, params, cb) {
    request
        .get(url)
        .send(params)
        .end(function (err, response) {
            if (!error && response.statusCode == 200) {
                console.log(response.text);
                return cb(response.text);
            }
            return cb();
        });
};

exports.post = function(url, params) {
    request
        .post(url)
        .send(params)
        .end(function (error, response) {
            if (!error && response.statusCode == 200) {
                console.log(response.text);
                return cb(response.text);
            }
            return cb();
        });
};


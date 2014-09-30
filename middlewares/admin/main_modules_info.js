/**
 * @file main_models_info.js
 * @namespace Main Models Info Middleware
 * @desc This module provides info about main modules
 */

var rek = require('rekuire'),
    settingsModel = rek('data/models/admin/setting');

function getModels(req, res, next) {
    settingsModel.findOne()
        .exec(function(err, doc) {
            if (err) return err;
            if (doc && doc.main_modules) {
                req.objects = doc.main_modules;
                next();
            } else {
                res.send({error: 'no settings'});
            }
        });

}

module.exports = getModels;
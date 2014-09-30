/**
 * @file main_modules_update.js
 * @namespace Main Modules Update Middleware
 * @desc This module update main modules setting
 */

var rek = require('rekuire'),
    settingModel = rek('data/models/admin/setting'),
    _ = require('underscore');

function updateModules() {
    return function(req, res, next) {
        settingModel.findOne()
            .exec(function(err, doc) {
                _.each(doc.main_modules, function(mod) {
                    if (mod.name == req.body.module) {
                        mod.enabled = req.body.enabled;
                        doc.markModified('main_modules');
                        doc.save();
                        next();
                    }
                });
            });
    };
}

module.exports = updateModules;
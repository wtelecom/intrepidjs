/**
 * @file modules_info.js
 * @namespace Modules Info Middleware
 * @desc This module provides info about modules
 */

var rek = require('rekuire');
var settingModel = rek('data/models/admin/setting');

function getModules(available) {
    return function(req, res, next) {
        if (req.query.available === 'true') {
            settingModel.getModules((req.query.available === 'true'), req, next);
        } else if (req.query.available !== 'false') {
            settingModel.getModules(available, req, next);
        } else {
            settingModel.getModules((req.query.available === 'true'), req, next);
        }
    };
}

module.exports = getModules;
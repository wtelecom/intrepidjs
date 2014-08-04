/**
 * @file modules_update.js
 * @namespace Modules Update Middleware
 * @desc This module update modules setting
 */

var rek = require('rekuire');
var settingModel = rek('data/models/admin/setting');

function updateModules() {
    return function(req, res, next) {
        settingModel.updateModules(req, next);
    };
}

module.exports = updateModules;
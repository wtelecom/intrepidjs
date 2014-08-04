/**
 * @file modules_create.js
 * @namespace Modules Update Middleware
 * @desc This module update modules setting
 */

var rek = require('rekuire');
var settingModel = rek('data/models/admin/setting');

function createModules() {
    return function(req, res, next) {
        settingModel.updateModules(req, next);
    };
}

module.exports = createModules;
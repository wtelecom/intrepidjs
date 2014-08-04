/**
 * @file theme_save.js
 * @namespace Save Theme Middleware
 * @desc This module save a theme
 */

var rek = require('rekuire');
var settingModel = rek('data/models/admin/setting');

function saveTheme() {
    return function(req, res, next) {
        settingModel.saveTheme(req, next);
    };
}

module.exports = saveTheme;
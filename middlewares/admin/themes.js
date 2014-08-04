/**
 * @file themes.js
 * @namespace Themes Middleware
 * @desc This module get themes of mongodb
 */

var rek = require('rekuire');
var settingModel = rek('data/models/admin/setting');

function getThemes() {
    return function(req, res, next) {
        settingModel.getThemes(req, next);
    };
}

module.exports = getThemes;
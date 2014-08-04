/**
 * @file theme_active.js
 * @namespace Active Theme Middleware
 * @desc This module set active a theme
 */

var rek = require('rekuire');
var settingModel = rek('data/models/admin/setting');

var loadResources = rek('libs/load_resources');
var settings = rek('/settings');

function activeTheme() {
    return function(req, res, next) {
        settingModel.activeTheme(req, function(theme){
            loadResources(null, settings.themesPath + theme);
        });
        next();
    };
}

module.exports = activeTheme;
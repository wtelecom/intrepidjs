/**
 * @file modules_update.js
 * @namespace Modules Update Middleware
 * @desc This module update modules setting
 */

var rek = require('rekuire'),
    settingModel = rek('data/models/admin/setting'),
    mainSettings = rek('/settings'),
    loadModules = rek('libs/load_modules');

function updateModules() {
    return function(req, res, next) {
        settingModel.updateModules(req, function(err) {
            if (req.body.enabled === false) {
                if (req.body.module) {
                    var mApp = rek('modules/' + req.body.module + '/app');
                    mApp.removeReferences(req.body.module);
                    next();
                }
            } else if (req.body.enabled === true) {
                if (req.body.module) {
                    loadModules(mainSettings.app_instance, mainSettings.modulesPath, [req.body.module], true, function() {
                        next();
                    });
                }
            }
            next();
        });
    };
}

module.exports = updateModules;
/**
 * @file load_modules.js
 * @namespace Load Modules Middleware
 * @desc Middleware to load modules
 */

var _ = require('underscore');
var rek = require('rekuire');
var settingModel = rek('data/models/admin/setting');

module.exports = function loadSelectedModules(app, path, modules_to_load) {
    var site_routes = ['./routes'];
    app.locals.modules = [];

    /**
     * @desc  Creates or updates a module db entry
     */
    function createModule(module) {
        var exists = false;
        settingModel.getModules(false, null, function(modules) {
            for (var index in modules) {
                if (modules[index].name == module.name) {
                    exists = true;
                    app.locals.modules.push(modules[index]);
                }
            }

            // If module not exists, create a new db entry
            if (!exists) {
                settingModel.addModule(module, function() {
                    console.log('%s DB entry created', module.name);
                });
            // If module exists, update db entry 
            } else {
                settingModel.updateModule(module, function(mod) {
                    console.log('%s DB entry updated', module.name);
                });
            }
        });
    }

    function loadModule(dir, module_name) {
        try {
            var mSettings = require(dir + '/settings');
            var moduleApp = require(dir + '/app');
            moduleApp.setModuleApp(app, dir, module_name);
            moduleApp.setModuleSections(app, mSettings);
            site_routes.push(moduleApp.setModuleRoutes(dir));
            var moduleInfo = {
                name: mSettings.route_prefix,
                real_name: mSettings.name,
                description: mSettings.description,
                actions: mSettings.actions,
            };
            createModule(moduleInfo);
        } catch (err) {
            console.log(err);
        }
    }

    for (var module in modules_to_load) {
        loadModule(path + modules_to_load[module], modules_to_load[module]);
    }

    if (site_routes.length > 0) {
        app.set('site_routes', site_routes);
    }
        
};

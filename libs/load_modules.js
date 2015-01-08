/**
 * @file load_modules.js
 * @namespace Load Modules Middleware
 * @desc Middleware to load modules
 */

var _ = require('underscore'),
    routescan = require('express-routescan'),
    rek = require('rekuire'),
    settingModel = rek('data/models/admin/setting');

module.exports = function loadSelectedModules(app, path, modules_to_load, fake, cbToLoad) {

    var total_count = 0,
        inc_count = 0;

    total_count = modules_to_load.length;

    app.set('site_routes', ['./routes']);

    if (!app.locals.modules) {
        app.locals.modules = [];
    }

    /**
     * @desc  Modules operations (create or update)
     */
    function opModule(module, moduleData, cb) {
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
                    cb(moduleData, false);
                });
            // If module exists, update db entry 
            } else {
                settingModel.updateModule(module, function(setting) {
                    var enabled = false;
                    _.each(setting.modules, function(mod) {
                        if (mod.name == module.name) {
                            enabled = mod.enabled;
                        }
                    });
                    console.log('%s DB entry updated', module.name);
                    cb(moduleData, enabled);
                });
            }
        });
    }

    function loadModule(dir, module_name) {
        try {
            var mSettings = require(dir + '/settings');
            var moduleApp = require(dir + '/app');
            var moduleInfo = {
                name: mSettings.route_prefix,
                real_name: mSettings.name,
                description: mSettings.description,
                actions: mSettings.actions,
            };

            var moduleData = {
                name: module_name,
                settings: mSettings,
                app: moduleApp,
                info: moduleInfo,
                path: dir
            };

            if (!fake) {
                opModule(moduleInfo, moduleData, function(data, enabled) {
                    inc_count ++;
                    if (enabled) {
                        data.app.setModuleApp(app, data.path, data.name);
                        data.app.setModuleSections(app, data.settings);
                        app.get('site_routes').push(data.app.setModuleRoutes(data.path, app));
                    }

                    if (inc_count == total_count) {
                        cbToLoad();
                    }
                });
            } else {
                moduleApp.setModuleSections(app, mSettings);
                routescan(app, {
                    directory: [dir + '/routes', dir + '/dynamic_routes']
                });
            }
            
        } catch (err) {
            console.log(err);
        }
    }

    if (!_.isEmpty(modules_to_load)) {
        for (var module in modules_to_load) {
            loadModule(path + modules_to_load[module], modules_to_load[module]);
        }
    } else {
        cbToLoad();
    }
};

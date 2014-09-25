/**
 * @file dynamic_apis_routes.js
 * @desc Middleware to load dynamic API's modules routes on the fly
 */

var diveSync = require('diveSync'),
    path = require('path'),
    rek = require('rekuire'),
    settings = rek('/settings'),
    _ = require('underscore'),
    createSchemaCrudMethods = rek('middlewares/create_models_crud_operations');

/**
 * @desc Make API's modules routes available
 * @return object - Dynamic API's routes
 */
function dynamicRoutes() {
    var routes = {};
    var models = [];

    /**
     * @desc Dive into the modules data dir to get models files
     */
    function dive(route, module, modSetting) {
        /**
         * @desc Search models in the path
         */

        function checkAndInsert(file) {
            var extname = path.extname(file),
                ms = require(modSetting);

            if (extname == '.js') {
                // With this logic, we create a models registry to use an any place
                var moduleObj = _.findWhere(settings.models, {module: module});
                if (_.isEmpty(moduleObj)) {
                    settings.models.push({module: module, models:[{file: file}]});
                } else {
                    moduleObj.models.push({file: file});
                }

                models.push({
                    module: module,
                    modelFile: file,
                    name: _.last(
                        file
                        .replace('.js', '')
                        .split('/')
                    ),
                    should_be_private: function() {
                        if (ms.privacy) {
                            var privacy = false;
                            _.each(ms.privacy, function(value, key) {
                                if (key == _.last(file.split('/')).replace('.js', '')) {
                                    if (value) {
                                        privacy = value;
                                    }
                                }
                            });
                            return privacy;
                        } else {
                            return false;
                        }
                    }
                });
            }
        }

        diveSync(route,
            {
                directories: false,
                all: false,
                recursive: true
            }, function(err, file) {
                if (!err) checkAndInsert(file);
            }
        );
    }

    if (!_.isEmpty(settings.modules)) {
        _.each(settings.modules, function(module) {
            var modModelPath = path.join(process.cwd(),
                    'modules/' + module + '/data/models'
                ),
                mSetting = path.join(process.cwd(),
                    'modules/' + module + '/settings'
                );

            dive(modModelPath, module, mSetting);
        });

        return createSchemaCrudMethods(models);

    } else {
        
        return routes;
    }

    
}

module.exports = dynamicRoutes();

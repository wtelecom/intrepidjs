
/**
 * Middleware to insert custom theme
 */

var diveSync = require('diveSync'),
    path = require('path'),
    expressStatic = require('serve-static'),
    rek = require('rekuire'),
    settingModel = rek('data/models/admin/setting'),
    mainSettings = rek('/settings'),
    _ = require('underscore');

module.exports = function loadResources(app, route, module) {
    // Checks and creates locals arrays for styles
    if (!mainSettings.styleFiles) {
        mainSettings.styleFiles = [];
    }

    // Checks and creates locals arrays for javascripts
    if (!mainSettings.jsFiles) {
        mainSettings.jsFiles = [];
    }

    function findModules(dir) {
        // Parse route to add the static
        function checkAndInsert(file) {
            var extname = path.extname(file);

            // Checks if extension is .css
            if (extname === '.css') {
                if (!module) {
                    var rm_css = null;
                    _.each(mainSettings.styleFiles, function(theme, i) {
                        if (theme.type == 'default') {
                            rm_css = i;
                        }
                    });

                    if (!_.isNull(rm_css))
                        mainSettings.styleFiles.splice(rm_css, 1);

                    mainSettings.styleFiles.push({
                        type: 'default',
                        path: file.replace(mainSettings.rootPath + '/public', '')
                    });
                } else {
                    mainSettings.styleFiles.push({
                        type: 'module',
                        path: file.replace(mainSettings.rootPath + '/modules/' + module + '/public', '/' + module + '/public')
                    });
                }

            // Checks if extension is .js
            } else if (extname === '.js') {
                if (!module) {
                    var rm_js = null;
                    _.each(mainSettings.jsFiles, function(theme, i) {
                        if (theme.type == 'default') {
                            rm_js = i;
                        }
                    });

                    if (!_.isNull(rm_js))
                        mainSettings.jsFiles.splice(rm_js, 1);

                    mainSettings.jsFiles.push({
                        type: 'default',
                        path: file.replace(mainSettings.rootPath + '/public', '')
                    });
                } else {
                    mainSettings.jsFiles.push({
                        type: 'module',
                        path: file.replace(mainSettings.rootPath + '/modules/' + module + '/public', '/' + module + '/public')
                    });
                }
            }
        }

        // If load root resources
        if (!module && app) {
            settingModel.getActiveTheme(function(theme) {
                dive(dir + theme);
            });
        } else {
            dive(dir);
        }

        // Dive into the dir to get .css and .js files
        function dive(path) {
            diveSync(path,
                {
                  directories: false,
                  all: false,
                  recursive: true
                }, function(err, file) {
                    // if (err) throw err;
                    if (!err) checkAndInsert(file);
                }
            );
        }
    }

    if (module) {
        app.use(
            '/' + module + '/public',
            expressStatic(
                path.join(mainSettings.rootPath,
                    'modules/' + module + '/public/'
                )
            )
        );
    }


    findModules(route);
};

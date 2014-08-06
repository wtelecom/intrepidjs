
/**
 * Middleware to insert custom theme
 */

var diveSync = require('diveSync'),
    path = require('path'),
    expressStatic = require('serve-static'),
    rek = require('rekuire'),
    settingModel = rek('data/models/admin/setting'),
    settings = rek('/settings'),
    _ = require('underscore');

module.exports = function loadResources(app, route, module) {
    // Checks and creates locals arrays for styles
    if (!settings.styleFiles) {
        settings.styleFiles = [];
    }

    // Checks and creates locals arrays for javascripts
    if (!settings.jsFiles) {
        settings.jsFiles = [];
    }

    function findModules(dir) {
        // Parse route to add the static
        function checkAndInsert(file) {
            var extname = path.extname(file);

            // Checks if extension is .css
            if (extname === '.css') {
                if (!module) {
                    var rm_css = null;
                    _.each(settings.styleFiles, function(theme, i) {
                        if (theme.type == 'default') {
                            rm_css = i;
                        }
                    });

                    if (!_.isNull(rm_css))
                        settings.styleFiles.splice(rm_css, 1);

                    settings.styleFiles.push({
                        type: 'default',
                        path: file.replace(process.cwd() + '/public', '')
                    });
                } else {
                    settings.styleFiles.push({
                        type: 'module',
                        path: file.replace(process.cwd() + '/modules/' + module + '/public', '/' + module + '/public')
                    });
                }

            // Checks if extension is .js
            } else if (extname === '.js') {
                if (!module) {
                    var rm_js = null;
                    _.each(settings.jsFiles, function(theme, i) {
                        if (theme.type == 'default') {
                            rm_js = i;
                        }
                    });

                    if (!_.isNull(rm_js))
                        settings.jsFiles.splice(rm_js, 1);

                    settings.jsFiles.push({
                        type: 'default',
                        path: file.replace(process.cwd() + '/public', '')
                    });
                } else {
                    settings.jsFiles.push({
                        type: 'module',
                        path: file.replace(process.cwd() + '/modules/' + module + '/public', '/' + module + '/public')
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
                path.join(process.cwd(),
                    'modules/' + module + '/public/'
                )
            )
        );
    }


    findModules(route);
};

/**
 * @file app.js
 * @namespace Main widget file
 * @desc Twitter's widget init methods
 */

var rek = require('rekuire'),
    path = require('path'),
    expressStatic = require('serve-static'),
    diveSync = require('diveSync'),
    _ = require('underscore');

/**
  * @desc  Loads widgets public data
  * @param object $app - App instance
  * @param object $route - Widget path
  * @param String $name - Widget name
*/
exports.setWidgetPublic = function(app, route, name) {
    // Initializing static widget path
    app.use(
        '/widgets/' + name + '/public/',
        expressStatic(
            path.join(process.cwd(),
                'widgets/social_widgets/' + name + '/public/'
            )
        )
    );

    var widget_js_files = [];

    // Load social widgets public files
    // Dive into widget public dir
    function dive(path) {
        diveSync(path,
            {
              directories: false,
              all: false,
              recursive: true
            }, function(err, file) {
                if (!err) checkAndInsert(file);
            }
        );
    }

    // Check if file extension
    function checkAndInsert(file) {
        var extname = path.extname(file);

        // Checks if extension is .js
        if (extname === '.js') {
            widget_js_files.push(
                '/widgets/' + name + '/public/javascripts/' + _.last(file.split('/'))
            );
        }
    }

    dive(route + '/public');

    if (!app.locals.widgets_js_files) {
        app.locals.widgets_js_files = [];
        app.locals.widgets_js_files = widget_js_files;
    } else {
        app.locals.widgets_js_files = app.locals.widgets_js_files.concat(widget_js_files);
    }
};

/**
  * @desc  Set module route
  * @param string $path - Module path
  * @return string - Module routes path
*/
exports.setWidgetRoutes = function(path) {
    return path + '/routes';
};
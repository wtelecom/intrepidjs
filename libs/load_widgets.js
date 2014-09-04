/**
 * @file load_widgets.js
 * @namespace Load Widgets Middleware
 * @desc Middleware to load widgets
 */

var _ = require('underscore'),
    _s = require('underscore.string'),
    path = require('path'),
    expressStatic = require('serve-static'),
    diveSync = require('diveSync'),
    rek = require('rekuire'),
    mainSettings = rek('/settings');

module.exports = function loadWidgets(app) {
    var modules_routes = ['./routes'];

    // Initializing main static widget path
    app.use(
        '/widgets/',
        expressStatic(
            path.join(process.cwd(),
                'widgets/'
            )
        )
    );

    // Load social widgets
    // Dive into widget partials dir
    function dive(path, widget_obj) {
        diveSync(path,
            {
              directories: false,
              all: false,
              recursive: true
            }, function(err, file) {
                if (!err) checkAndInsert(file, widget_obj);
            }
        );
    }

    // Check if file is .jade
    function checkAndInsert(file, widget_obj) {
        var extname = path.extname(file);

        // Checks if extension is .jade
        if (extname === '.jade') {
            var partial_name = _.last(file.split('/')).replace('.jade', '');
            widget_obj.partials.push(
                {
                    url: '/widget/' + widget_obj.name + '/partials/' + partial_name,
                }
            );
        }
    }

    _.each(mainSettings.widgets.social, function(element) {
        var route = mainSettings.socialwidgetsPath + element.name,
            widgetInit = require(route + '/app'),
            widgetRoutes = widgetInit.setWidgetRoutes(route);

        app.get('site_routes').push(widgetRoutes);

        element.main_url = '/widget/' + element.name + '/index';

        dive(mainSettings.socialwidgetsPath + element.name + '/views/partials', element);
    });
};

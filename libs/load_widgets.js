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

module.exports = function loadWidgets(app, cb) {

    // Initializing main static widget path
    app.use(
        '/widgets/public/',
        expressStatic(
            path.join(process.cwd(),
                'widgets/public/'
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
                    url: '/widget/' + widget_obj.name + '/admin/partials/' + partial_name,
                }
            );
        }
    }

    // Social widgets
    if (!_.isEmpty(mainSettings.widgets.social)) {
        _.each(mainSettings.widgets.social, function(element) {
            var route = mainSettings.socialwidgetsPath + element.name,
                widgetInit = require(route + '/app'),
                widgetRoutes = widgetInit.setWidgetRoutes(route);

            widgetInit.setWidgetPublic(app, route, element.name);

            app.get('site_routes').push(widgetRoutes);

            element.main_url = '/widget/' + element.name + '/index';
            dive(mainSettings.socialwidgetsPath + element.name + '/views/admin_partials', element);
        });
    }

    // Custom widgets
    if (!_.isEmpty(mainSettings.widgets.custom)) {
        _.each(mainSettings.widgets.custom, function(element) {
            var route = mainSettings.customwidgetsPath + element.name,
                widgetInit = require(route + '/app'),
                widgetRoutes = widgetInit.setWidgetRoutes(route);

            widgetInit.setWidgetPublic(app, route, element.name);

            app.get('site_routes').push(widgetRoutes);

            element.main_url = '/widget/' + element.name + '/index';
            dive(mainSettings.customwidgetsPath + element.name + '/views/admin_partials', element);
        });
    }
    
    cb();
};

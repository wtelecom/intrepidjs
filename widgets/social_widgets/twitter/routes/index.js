/**
 * @file index.js
 * @namespace Twitter widget Routes
 * @desc Twitter widget routes
 */

var rek = require('rekuire'),
    twitterSettings = rek('widgets/social_widgets/twitter/settings'),
    twitterURLWidgetPrefix = 'widget/twitter';

/**
 * @desc  Twitter partial route
 * @return object - Twitter partial render
 */

var routes = {};

routes['/' + twitterURLWidgetPrefix + '/index'] =  {
    methods: ['get'],
    middleware: [],
    fn: function(req, res, next) {
        res.render(twitterSettings.viewsPath + '/index');
    }
};

routes['/' + twitterURLWidgetPrefix + '/elements'] =  {
    methods: ['get'],
    middleware: [],
    fn: function(req, res, next) {
        res.json(
            {
                'elements': req.objects,
                'success': true
            }
        );
    }
};

routes['/' + twitterURLWidgetPrefix + '/partials/:name'] =  {
    methods: ['get'],
    middleware: [],
    fn: function(req, res, next) {
        var name = req.params.name;
        res.render(twitterSettings.viewsPath + '/partials/' + name);
    }
};

routes['/' + twitterURLWidgetPrefix + '/admin/partials/:name'] =  {
    methods: ['get'],
    middleware: [],
    fn: function(req, res, next) {
        var name = req.params.name;
        res.render(twitterSettings.viewsPath + '/admin_partials/' + name);
    }
};

module.exports = routes;
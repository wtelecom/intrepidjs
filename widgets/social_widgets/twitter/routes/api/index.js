var _ = require('underscore'),
    rek = require('rekuire'),
    mainSettings = rek('/settings'),
    settings = rek('widgets/social_widgets/twitter/settings'),
    timelineMiddleware = rek('widgets/social_widgets/twitter/middlewares/timeline');


var routes = {};

/**
 * @desc  Show a measures list
 * @return object - Measures list response
 */
routes[mainSettings.apiPrefix + '/widget/' + settings.route_prefix + '/timeline'] = [
    {
        methods: ['get'],
        middleware: [timelineMiddleware()],
        fn: function(req, res, next) {
            res.json(
                {
                    widgets: req.objects,
                    'success': true
                }
            );
        }
    },
    {
        methods: ['post'],
        middleware: [timelineMiddleware()],
        fn: function(req, res, next) {
            res.json(
                {
                    widgets: req.objects,
                    'success': true
                }
            );
        }
    }
];

module.exports = routes;
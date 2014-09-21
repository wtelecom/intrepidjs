var _ = require('underscore'),
    rek = require('rekuire'),
    mainSettings = rek('/settings'),
    settings = rek('widgets/custom_widgets/carousel/settings'),
    carouselMiddleware = rek('widgets/custom_widgets/carousel/middlewares/carousel');


var routes = {};

/**
 * @desc  Get and set carousel widget info
 * @return object - Conrousel data response
 */
routes[mainSettings.apiPrefix + '/widget/' + settings.route_prefix + '/detail'] = [
    {
        methods: ['get'],
        middleware: [carouselMiddleware()],
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
        middleware: [carouselMiddleware()],
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
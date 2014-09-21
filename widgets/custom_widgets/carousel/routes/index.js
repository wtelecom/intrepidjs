/**
 * @file index.js
 * @namespace Carousel widget Routes
 * @desc Carousel widget routes
 */

var rek = require('rekuire'),
    carouselSettings = rek('widgets/custom_widgets/carousel/settings'),
    carouselURLWidgetPrefix = 'widget/carousel';

/**
 * @desc  Carousel partial route
 * @return object - Carousel partial render
 */

var routes = {};

routes['/' + carouselURLWidgetPrefix + '/index'] =  {
    methods: ['get'],
    middleware: [],
    fn: function(req, res, next) {
        res.render(carouselSettings.viewsPath + '/index');
    }
};

routes['/' + carouselURLWidgetPrefix + '/elements'] =  {
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

routes['/' + carouselURLWidgetPrefix + '/partials/:name'] =  {
    methods: ['get'],
    middleware: [],
    fn: function(req, res, next) {
        var name = req.params.name;
        res.render(carouselSettings.viewsPath + '/partials/' + name);
    }
};

routes['/' + carouselURLWidgetPrefix + '/admin/partials/:name'] =  {
    methods: ['get'],
    middleware: [],
    fn: function(req, res, next) {
        var name = req.params.name;
        res.render(carouselSettings.viewsPath + '/admin_partials/' + name);
    }
};

module.exports = routes;
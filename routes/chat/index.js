

var settings = require('../../settings');


var routes = {};

/**
 * @desc  Measure partial route
 * @return object - Measure partial render
 */
routes['/chat/partials/:name'] =  {
    methods: ['get'],
    middleware: [],
    fn: function(req, res, next) {
        var name = req.params.name;
        res.render(settings.viewsPath + 'chat/partials/' + name);
    }
};

module.exports = routes;
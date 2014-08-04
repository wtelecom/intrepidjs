/**
 * @file index.js
 * @namespace @name Routes
 * @desc @name routes
 */

var _ = require('underscore'),
    rek = require('rekuire'),
    m_settings = rek('modules/@iname/settings');


var routes = {};


/**
 * @desc  Main @name route
 * @return object - @name main page render
 */
routes['/' + m_settings.route_prefix] =  {
    methods: ['get'],
    middleware: [],
    fn: function(req, res, next) {
        res.render(m_settings.viewsPath + 'index');
    }
};

/**
 * @desc  @name partial route
 * @return object - @name partial render
 */
routes['/' + m_settings.route_prefix + '/partials/:name'] =  {
    methods: ['get'],
    middleware: [],
    fn: function(req, res, next) {
        var name = req.params.name;
        res.render(m_settings.viewsPath + '/partials/' + name);
    }
};

module.exports = routes;

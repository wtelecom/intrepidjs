/**
 * @file admin.js
 * @namespace @name Admin Routes
 * @desc @name admin routes
 */

var rek = require('rekuire'),
    m_settings = rek('modules/@iname/settings');

var routes = {};


/**
 * @desc  Parent admin @name route
 * @return object - @name admin parent page render
 */
routes['/' + m_settings.route_prefix + '/admin/parent'] =  {
    methods: ['get'],
    middleware: [],
    fn: function(req, res, next) {
        res.render(m_settings.viewsPath + 'admin/parent');
    }
};


module.exports = routes;


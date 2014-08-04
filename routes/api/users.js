/**
 * API Users methods
 */

var settings = require('../../settings');
var _ = require('underscore');
var rek = require('rekuire');
var loadObgetsMiddleware = rek('middlewares/load_objects');
var accountModel = rek('data/models/user/account');

var routes = {};

routes[settings.apiPrefix + '/users'] =  {
    methods: ['get'],
    middleware: [loadObgetsMiddleware(accountModel, null, null, null)],
    fn: function(req, res, next) {
        res.json(
            {
                'response': 'successful',
                'users': req.objects
            }
        );
    }
};


module.exports = routes;

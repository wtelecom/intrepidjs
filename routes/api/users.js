/**
 * API Users methods
 */

var settings = require('../../settings');
var _ = require('underscore');
var rek = require('rekuire');
var loadObgetsMiddleware = rek('middlewares/load_objects');
var accountModel = rek('data/models/user/account');
var updateUser = rek('middlewares/users/update');

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

routes[settings.apiPrefix + '/users/:id/update'] =  {
    methods: ['post'],
    middleware: [updateUser],
    fn: function(req, res, next) {
        res.json(
            {
                'response': 'successful',
                'object': req.object
            }
        );
    }
};


module.exports = routes;

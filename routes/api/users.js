/**
 * API Users methods
 */

var settings = require('../../settings');
var _ = require('underscore');
var rek = require('rekuire');
var loadObgetsMiddleware = rek('middlewares/load_objects');
var accountModel = rek('data/models/user/account');
var updateUser = rek('middlewares/users/update');
var checkPass = rek('middlewares/users/check_password');
var changePass = rek('middlewares/users/change_password');
var findUser = rek('middlewares/users/find_user');
var existUser = rek('middlewares/users/load_user');


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

routes[settings.apiPrefix + '/user/password'] = {
    methods: ['post'],
    middleware: [checkPass],
    fn: function(req, res, next) {}
};

routes[settings.apiPrefix + '/user/password/change'] = {
    methods: ['post'],
    middleware: [changePass],
    fn: function(req, res, next) {}
};

routes[settings.apiPrefix + '/user/:id'] = {
    methods: ['get'],
    middleware: [findUser],
    fn: function(req, res, next) {
        res.send({
            success: true,
            user: req.user
        });
    }
};

routes[settings.apiPrefix + '/users/exist/:name'] = {
    methods: ['get'],
    middleware: [existUser],
    fn: function(req, res, next) {
        if (!req.user) {
            res.send({available: true});
        } else {
            res.send({available: false});
        }
    }
};


module.exports = routes;

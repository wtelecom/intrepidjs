/**
 * @file create_models_crud_oprations.js
 * @desc Set CRUD methods on the fly
 */

var rek = require('rekuire'),
    settings = rek('/settings'),
    _ = require('underscore'),
    hasAuthorization = rek('middlewares/authorization'),
    getMethod = rek('libs/crud_api_operations/get'),
    getAllMethod = rek('libs/crud_api_operations/getAll'),
    createMethod = rek('libs/crud_api_operations/create'),
    updateMethod = rek('libs/crud_api_operations/update'),
    deleteMethod = rek('libs/crud_api_operations/delete');

/**
 * @desc Set CRUD methods
 * @return object - Dynamic API's routes
 */
module.exports = function(models) {
    var routes = {};

    _.each(models, function(model) {
        _.each(
            ['get', 'getAll', 'create', 'update', 'delete'],
            function(method) {
                applyCrudMethod(method, model);
            }
        );
    });

    /**
     * @desc Apply CRUD methods to the models 
     * @return object - Dynamic API's model routes
     */
    function applyCrudMethod(method, model) {
        var modelFile = require(model.modelFile);

        switch(method) {
            case 'get':
                routes[
                    settings.apiPrefix +
                    '/' +
                    model.module +
                    '/' +
                    model.name +
                    '/:id'
                ] =  {
                    methods: ['get'],
                    middleware: [getMethod(modelFile)],
                    fn: function(req, res, next) {
                        res.json({
                            response: req.response,
                            objects: req.objects
                        });
                    }
                };
                break;
            case 'getAll':
                routes[
                    settings.apiPrefix +
                    '/' +
                    model.module +
                    '/' +
                    model.name
                ] =  {
                    methods: ['get'],
                    middleware: [getAllMethod(modelFile, model.should_be_private())],
                    fn: function(req, res, next) {
                        res.json({
                            response: req.response,
                            objects: req.objects
                        });
                    }
                };
                break;
            case 'create':
                routes[
                    settings.apiPrefix +
                    '/' +
                    model.module +
                    '/' +
                    model.name +
                    '/create'
                ] =  {
                    methods: ['post'],
                    middleware: [
                        hasAuthorization(),
                        createMethod(modelFile)
                    ],
                    fn: function(req, res, next) {
                        res.json({
                            response: req.response,
                            objects: req.objects
                        });
                    }
                };
                break;
            case 'update':
                routes[
                    settings.apiPrefix +
                    '/' +
                    model.module +
                    '/' +
                    model.name +
                    '/:id/update'
                ] =  {
                    methods: ['post'],
                    middleware: [
                        hasAuthorization(modelFile),
                        updateMethod(modelFile)
                    ],
                    fn: function(req, res, next) {
                        res.json({
                            response: req.response,
                            objects: req.objects
                        });
                    }
                };
                break;
            case 'delete':
                routes[
                    settings.apiPrefix +
                    '/' +
                    model.module +
                    '/' +
                    model.name +
                    '/:id/delete'
                ] =  {
                    methods: ['post'],
                    middleware: [
                        hasAuthorization(modelFile),
                        deleteMethod(modelFile)
                    ],
                    fn: function(req, res, next) {
                        res.json({
                            response: req.response,
                            objects: req.objects
                        });
                    }
                };
                break;
            default:
                break;
        }
    }

    return routes;
};


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
        var moduleSettings = require(settings.modulesPath + model.module + '/settings');
        _.each(
            ['get', 'getAll', 'create', 'update', 'delete'],
            function(method) {
                applyCrudMethod(method, model, moduleSettings);
            }
        );
    });


    /**
     * @desc Loads extra middlewares
     * @return object - Dynamic API's model routes
     */
    function loadExtraModuleMiddlewares(method, msettings, model) {
        var middleware = null;
        if (msettings.onTheFlyMiddlewares) {
            if (msettings.onTheFlyMiddlewares[model]) {
                if (!_.isNull(msettings.onTheFlyMiddlewares[model][method])) {
                    middleware = require(msettings.onTheFlyMiddlewares[model][method]);
                }
            }
        }
        if (!_.isNull(middleware)) {
            return middleware();
        } else {
            return function(req, res, next) { next(); };
        }
    }

    /**
     * @desc Apply CRUD methods to the models 
     * @return object - Dynamic API's model routes
     */
    function applyCrudMethod(method, model, msettings) {
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
                    middleware: [
                        getMethod(modelFile),
                        loadExtraModuleMiddlewares(method, msettings, model.name)
                    ],
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
                    middleware: [
                        getAllMethod(modelFile, model.should_be_private()),
                        loadExtraModuleMiddlewares(method, msettings, model.name)
                    ],
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
                        hasAuthorization(modelFile),
                        createMethod(modelFile),
                        loadExtraModuleMiddlewares(method, msettings, model.name)
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
                        updateMethod(modelFile),
                        loadExtraModuleMiddlewares(method, msettings, model.name)
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
                        deleteMethod(modelFile),
                        loadExtraModuleMiddlewares(method, msettings, model.name)
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


 /**
 * @file admin.js
 * @namespace Admin API Routes
 * @desc API Admin methods
 */

var rek = require('rekuire'),
    settings = rek('/settings'),
    modulesMiddleware = rek('middlewares/admin/modules_info'),
    modelsMiddleware = rek('middlewares/admin/models_info'),
    usersMiddleware = rek('middlewares/admin/users_info'),
    modulesCreateMiddleware = rek('middlewares/admin/modules_create'),
    modulesUpdateMiddleware = rek('middlewares/admin/modules_update'),
    themesMiddleware = rek('middlewares/admin/themes'),
    activeThemeMiddleware = rek('middlewares/admin/theme_active');

var routes = {};


/**
  * @desc  Get modules models data
  * @return array - Models availables
*/
routes[settings.apiPrefix + settings.siteRoutes.admin.route + '/models'] =  {
    methods: ['get'],
    middleware: [modelsMiddleware()],
    fn: function(req, res, next) {
        res.json(
            {
                'models': req.objects,
                'success': true
            }
        );
    }
};

/**
  * @desc  Get users evolution data
  * @return array - Users evolution data object
*/
routes[settings.apiPrefix + settings.siteRoutes.admin.route + '/users'] =  {
    methods: ['get'],
    middleware: [usersMiddleware()],
    fn: function(req, res, next) {
        res.json(
            {
                'users': req.objects,
                'success': true
            }
        );
    }
};


/**
  * @desc  Get modules available in the system
  * @param bool $available - Returns only modules enabled
  * @return array - Modules requested
*/
routes[settings.apiPrefix + settings.siteRoutes.admin.route + '/modules/'] =  {
    methods: ['get'],
    middleware: [modulesMiddleware(false)],
    fn: function(req, res, next) {
        res.json(
            {
                'modules': req.objects,
                'success': true
            }
        );
    }
};

/**
  * @desc  Creates the db entry for each modules available in the system
  * @return bool - Success response
*/
routes[settings.apiPrefix + settings.siteRoutes.admin.route + '/modules/create'] =  {
    methods: ['post'],
    middleware: [modulesCreateMiddleware],
    fn: function(req, res, next) {
        res.json(
            {
                'success': true
            }
        );
    }
};

/**
  * @desc  Updates modules available in the system
  * @return bool - Success response
*/
routes[settings.apiPrefix + settings.siteRoutes.admin.route + '/modules/update'] =  {
    methods: ['post'],
    middleware: [modulesUpdateMiddleware()],
    fn: function(req, res, next) {
        res.json(
            {
                'success': true
            }
        );
    }
};

/**
  * @desc - Get themes available in the system
  * @return array - Themes requested
  * @return string - Active theme
  * @return array - Default themes
*/
routes[settings.apiPrefix + settings.siteRoutes.admin.route + '/themes'] =  {
    methods: ['get', 'post'],
    middleware: [themesMiddleware()],
    fn: function(req, res, next) {
        res.json(
            {
                'themes': req.objects,
                'active': req.active,
                'default': req.default
            }
        );
    }
};

/**
  * @desc - Update active theme in the system
  * @return bool - Success response
*/
routes[settings.apiPrefix + settings.siteRoutes.admin.route + '/themes/active'] =  {
    methods: ['post'],
    middleware: [activeThemeMiddleware()],
    fn: function(req, res, next) {
        res.json(
            {
                'success': true
            }
        );
    }
};

/**
  * @desc - Edit a theme
  * @return bool - Success response
*/
routes[settings.apiPrefix + settings.siteRoutes.admin.route + '/themes/edit'] =  {
    methods: ['post'],
    middleware: [themesMiddleware()],
    fn: function(req, res, next) {
        res.json(
            {
                'theme': req.theme
            }
        );
    }
};

module.exports = routes;

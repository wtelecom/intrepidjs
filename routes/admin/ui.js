/**
 * UI methods
 */

var settings = require('../../settings'),
    rek = require('rekuire'),
    compileSassMiddleware = rek('middlewares/admin/compile_sass'),
    formValidation = rek('middlewares/form_validation'),
    modulesMiddleware = rek('middlewares/admin/modules_info'),
    saveThemeMiddleware = rek('middlewares/admin/theme_save');

var routes = {};

routes[settings.siteRoutes.admin.route + '/ui/'] =  {
    methods: ['get'],
    middleware: [
        compileSassMiddleware
    ],
    fn: function(req, res, next) {
        res.json(
            {
                'response': 'successful'
            }
        );
    }
};

routes[settings.siteRoutes.admin.route + '/dist'] =  {
    methods: ['get'],
    middleware: [
        modulesMiddleware(true)
    ],
    fn: function(req, res, next) {
        res.render(
            'admin/partials/dist',
            {
                modules: req.objects
            }
        );
    }
};

routes[settings.siteRoutes.admin.route + '/customstyle'] =  [{
//     methods: ['get'],
//     middleware: [],
//     fn: function(req, res, next) {
//         res.render('admin/partials/customstyle');
//     }
// },
// {
    methods: ['post'],
    middleware: [
        formValidation,
        saveThemeMiddleware(),
        compileSassMiddleware
    ],
    fn: function(req, res, next) {
        // res.render('admin/customstyle');
        res.json();
    }
}];

module.exports = routes;

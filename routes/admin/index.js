/**
 * Admin Index methods
 */

var settings = require('../../settings');
var rek = require('rekuire');
var modulesMiddleware = rek('middlewares/admin/modules_info');

var routes = {};

routes[settings.siteRoutes.admin.route + '/'] =  {
    methods: ['get'],
    middleware: [],
    fn: function(req, res, next) {
        res.render('admin/index', {
                
        });
    }
};

// routes[settings.siteRoutes.admin.route + '/modules'] =  {
//     methods: ['get'],
//     middleware: [modulesMiddleware(false)],
//     fn: function(req, res, next) {
//         res.render('admin/modules',
//             {
//                 modules: req.objects
//             }
//         );
//     }
// };

// routes[settings.siteRoutes.admin.route + '/dashboard'] =  {
//     methods: ['get'],
//     middleware: [modulesMiddleware(false)],
//     fn: function(req, res, next) {
//         res.render('admin/dashboard',
//             {
//                 // modules: req.objects
//             }
//         );
//     }
// };

routes[settings.siteRoutes.admin.route + '/partials/:name'] =  {
    methods: ['get'],
    middleware: [],
    fn: function(req, res, next) {
        var name = req.params.name;
        res.render(settings.viewsPath + 'admin/partials/' + name);
    }
};

module.exports = routes;

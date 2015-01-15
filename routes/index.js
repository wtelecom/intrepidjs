/**
 * Index routes.
 */

var passport = require("passport");
var rek = require('rekuire');
var loadPostsMiddleware = rek('middlewares/blog/load_posts');
var loadHighlightsMiddleware = rek('middlewares/load_highlights');
var loadHorizontalModules = rek('middlewares/load_horizontal_modules');
var modulesMiddleware = rek('middlewares/admin/modules_info');
var settings = rek('/settings');
var _ = require('underscore');

module.exports = {
    // Default routes
    '/': {
        methods: ['get'],
        middleware: [modulesMiddleware(true), loadHorizontalModules],
        fn: function(req, res, next) {
            res.render('index', {
                message: res.__('Hello IntrepidJS'),
                horizontal_modules_center: req.objects
            });
        }
    },

    '/info': {
        methods: ['get'],
        middleware: [],
        fn: function(req, res, next) {
            res.json({
                api_prefix: settings.apiPrefix,
                user: (req.user && typeof req.user === 'object') ? _.pick(req.user, '_id', 'image', 'username', 'email', 'firstName', 'lastName') : null
            });
        }
    },

    // Highlights routes
    '/highlights': {
        methods: ['get'],
        middleware: [modulesMiddleware(true), loadHighlightsMiddleware],
        fn: function(req, res, next) {
            res.render(
                'highlights',
                {
                    highlights_center: req.highlights_center,
                    highlights_left: req.highlights_left,
                    highlights_right: req.highlights_right
                }
            );
        }
    }/*Maybe we need this route to get horizontal modules
    ,
    '/horizontal_modules': {
        methods: ['get'],
        middleware: [modulesMiddleware(true), loadHorizontalModules],
        fn: function(req, res, next) {
            res.render(
                'horizontal_modules',
                {
                    horizontal_modules_center: req.objects,
                    //TODO: Add more posibilities to add horizontal modules in other places
                    //horizontal_left: req.highlights_left,
                    //horizontal_right: req.highlights_right
                }
            );
        }
    },*/
};
/**
 * Index routes.
 */

var passport = require("passport");
var rek = require('rekuire');
var loadPostsMiddleware = rek('middlewares/blog/load_posts');
var loadHighlightsMiddleware = rek('middlewares/load_highlights');
var modulesMiddleware = rek('middlewares/admin/modules_info');
var settings = rek('/settings');

module.exports = {
    // Default routes
    '/': {
        methods: ['get'],
        middleware: [],
        fn: function(req, res, next) {
            res.render('index', {
                message: res.__('Hello world'),
            });
        }
    },

    '/info': {
        methods: ['get'],
        middleware: [],
        fn: function(req, res, next) {
            res.json({
                api_prefix: settings.apiPrefix,
                user: {
                    _id: req.user ? req.user._id : null,
                    image: req.user ? req.user.image : null,
                    username: req.user ? req.user.username : null
                }
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
                    highlights_left: req.highlights_left,
                    highlights_right: req.highlights_right
                }
            );
        }
    }
};
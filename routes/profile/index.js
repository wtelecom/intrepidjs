/**
 * Profile routes.
 */


var rek = require('rekuire'),
    mainSettings = rek('/settings');

var routes = {};

routes['/profile'] =  {
    methods: ['get'],
    middleware: [],
    fn: function(req, res, next) {
        res.render('profile/index', {
                
        });
    }
};

routes['/profile/partials/:name'] =  {
    methods: ['get'],
    middleware: [],
    fn: function(req, res, next) {
        var name = req.params.name;
        res.render(mainSettings.viewsPath + 'profile/partials/' + name);
    }
};

module.exports = routes;
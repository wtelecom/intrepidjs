/**
 * Mail routes.
 */


var rek = require('rekuire'),
    createMail = rek('middlewares/mail/create_mail'),
    getMails = rek('middlewares/mail/get_mails'),
    getMail = rek('middlewares/mail/get_mail'),
    settings = rek('/settings');

var routes = {};

routes[settings.apiPrefix + '/mails'] =  {
    methods: ['get'],
    middleware: [getMails],
    fn: function(req, res, next) {
        res.send({
            success: true,
            mails: req.objects
        });
    }
};

routes[settings.apiPrefix + '/mails/create'] =  {
    methods: ['post'],
    middleware: [createMail],
    fn: function(req, res, next) {
        res.send({
            success: true,
            mail: req.object
        });
    }
};

routes[settings.apiPrefix + '/mails/:id'] =  {
    methods: ['get'],
    middleware: [getMail],
    fn: function(req, res, next) {
        res.send({
            success: true,
            mail: req.object
        });
    }
};

module.exports = routes;
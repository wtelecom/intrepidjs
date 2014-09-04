/**
 * API Index methods
 */

var rek = require('rekuire'),
    _ = require('underscore'),
    settings = rek('/settings');

var routes = {};

routes[settings.apiPrefix + '/info'] =  {
    methods: ['get'],
    middleware: [],
    fn: function(req, res, next) {
        res.json(
            {
                'response': 'successful',
                'user': req.user,
                'session': req.sessionID
            }
        );
    }
};

routes[settings.apiPrefix + '/perms'] =  {
    methods: ['get'],
    middleware: [],
    fn: function(req, res, next) {
        res.json(
            {
                'response': 'successful',
                'perms': req.user ? req.user.roles : []
            }
        );
    }
};

routes[settings.apiPrefix + '/room'] =  {
    methods: ['post'],
    middleware: [],
    fn: function(req, res, next) {
        if (_.isEmpty(req.session.chats)) {
            req.session.chats = [];
        }
        // Check if room is correct
        // TODO: check with validator if is ObjectId
        if (req.body.room && req.body.room != req.user._id) {
            // If this room does not exist in session, It is saved now.
            var isInSession = _.some(req.session.chats, function (room) {
                return room === req.body.room;
            });
            if (!isInSession)
                req.session.chats.push(req.body.room);
        }
        res.json(
            {
                'response': 'successful'
            }
        );
    }
};

module.exports = routes;

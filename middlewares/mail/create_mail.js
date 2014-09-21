
/**
 * Create a message
 */

var _ = require('underscore');
var rek = require('rekuire');
var mailModel = rek('data/models/mail/mail');
var create = rek('libs/crud_operations/create');

module.exports = function (req, res, next) {
    if (req.user && req.body) {
        req.body.user_src = req.user._id;
        req.body.read = false;
        req.body.read_by = [req.user._id];

        if (!req.body.reply) {
            create(mailModel, req.body, function(mail) {
                req.object = mail;
                next();
            });
        } else {
            mailModel.findOne({_id: req.body.reply})
                .exec(function(err, doc) {
                    if (err) res.send(err);
                    if (doc && req.body.text !== '') {
                        delete req.body.reply;
                        req.body.created = new Date();
                        doc.updated = req.body.created;
                        doc.children.push(req.body);
                        doc.read_by = req.body.read_by;
                        doc.save();
                        req.object = doc;
                        next();
                    } else {
                        res.send({message: 'no mail'});
                    }
                });
        }
    }

    
};


/**
 * Get a mail
 */

var _ = require('underscore');
var rek = require('rekuire');
var mailModel = rek('data/models/mail/mail');
var accountModel = rek('data/models/user/account');

module.exports = function (req, res, next) {
    var markRead = function (mail) {
        var readByMe = mail.read_by.indexOf(req.user._id)+1;
        if (!readByMe) {
            mail.read_by.push(req.user);
        }
        mail.save();
    };

    if (req.user && req.params && req.params.id) {
        mailModel.findOne({$and: [{$or: [{user_src: req.user._id}, {user_dst: req.user._id}]}, {_id: req.params.id}] })
            .populate('user_src', 'username image')
            .populate('user_dst', 'username image')
            .exec(function (err, mail) {
                if (err) return res.send(err);
                if (mail) {
                    if (mail.children.length) {
                        accountModel.populate(
                            mail.children,
                            { path:'user_src user_dst', select: 'username image' },
                            function(err, children) {
                                mail.children.reverse();
                                req.object = mail;
                                markRead(mail);
                                next();
                            }
                        );
                    } else {
                        req.object = mail;
                        markRead(mail);
                        next();
                    }
                } else {
                    res.send({message: 'no mail'});
                }
            });
    }
};

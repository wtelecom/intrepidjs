
/**
 * Get all messages
 */

var _ = require('underscore');
var rek = require('rekuire');
var mailModel = rek('data/models/mail/mail');
var accountModel = rek('data/models/user/account');

module.exports = function (req, res, next) {
    if (req.user) {
		mailModel.find({$or: [{user_src: req.user._id}, {user_dst: req.user._id}]})
            .sort({updated: -1})
            .populate('user_src', 'username image')
            .populate('user_dst', 'username image')
			.exec(function (err, mails) {
                var result = {
                    inbox: [],
                    sent: []
                };
                if (mails.length) {
                    mails.forEach(function(m) {
                        if (m.read_by.indexOf(req.user._id)+1) {
                            m.read = true;
                        }

                        if (m.children.length) {
                            var isSend = _.some(m.children, function(c) {
                                return String(c.user_src) === String(req.user._id);
                            });
                            var isInbox = _.some(m.children, function(c) {
                                return String(c.user_dst) === String(req.user._id);
                            });

                            if (isInbox || String(m.user_dst._id) === String(req.user._id)) {
                                result.inbox.push(m);
                            }
                            if (isSend || String(m.user_src._id) === String(req.user._id)) {
                                result.sent.push(m);
                            }
                        } else {
                            if (String(m.user_dst._id) === String(req.user._id)) {
                                result.inbox.push(m);
                            } else {
                                result.sent.push(m);
                            }
                        }
                    });
                }
                req.objects = result;
				next();
			});
	}
};

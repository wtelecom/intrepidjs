
/**
 * Create a message
 */

var _ = require('underscore'),
    rek = require('rekuire'),
    mailModel = rek('data/models/mail/mail'),
    create = rek('libs/crud_operations/create'),
    settings = rek('/settings'),
    accountModel = rek('data/models/user/account');


module.exports = function (req, res, next) {
    var sendEmail = function (mail) {
        accountModel.findById(mail.user_dst)
            .exec(function(err, user_dst) {
                if (user_dst && user_dst.email) {
                    var fromName = settings.site.title.content,
                        fromMail = settings.mail_instance.transporter.options.auth.user,
                        toMail = user_dst.email,
                        subject = mail.subject,
                        url = req.headers.origin + '/#/profile/mail/inbox';

                    var mailOptions = {
                        from: fromName + '<' + fromMail + '>',
                        to: toMail,
                        subject: 'New mail received',
                        text: 'New mail received with subject: ' + subject + ' Go to inbox: ' + url,
                        html: '<p>New mail received with subject: <b>' + subject + '</b></p><p><a href="' + url + '">Go to inbox</a></p>'
                    };
                    
                    settings.mail_instance.sendMail(mailOptions, function(error, info){
                        if(error){
                            console.log(error);
                        }else{
                            console.log('Message sent: ' + info.response);
                        }
                    });
                }
            });


    };

    if (req.user && req.body) {
        req.body.user_src = req.user._id;
        req.body.read = false;
        req.body.read_by = [req.user._id];

        if (!req.body.reply) {
            create(mailModel, req.body, function(mail) {
                req.object = mail;
                sendEmail(mail);
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
                        sendEmail(req.body);
                        next();
                    } else {
                        res.send({message: 'no mail'});
                    }
                });
        }
    }

    
};

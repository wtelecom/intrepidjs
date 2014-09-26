/**
 * @file update.js
 * @namespace Update User
 * @desc Update logic strategy
 */

var rek = require('rekuire'),
    Account = rek('data/models/user/account'),
    _ = require('underscore'),
    mainSettings = rek('/settings'),
    fs = require('fs'),
    uuid = require('node-uuid');


/**
 * @desc  Method to update an user
 * @return object - Updated user
 */
function update(req, res, next) {
    var isAdmin = req.user.roles.indexOf('admin') + 1,
        isTheUser = String(req.user._id) == req.params.id,
        reqUser = req.body;
    
    if (!_.isEmpty(reqUser)) {
        if (isAdmin || isTheUser) {
            Account.findById(req.params.id)
                .exec(function(err, user) {
                    if (err) return res.send(err);
                    else {
                        if (!isAdmin) {
                            // Only admins can modify "roles" property
                            reqUser = _.without(user, 'roles', 'subscriptions');
                        }

                        if (req.body.subscriptions) {
                            if (!_.has(user, 'subscriptions')) {
                                user['subscriptions'] = [];
                                user.subscriptions.push(req.body.subscriptions);
                            } else {
                                user.subscriptions = _.without(user.subscriptions, {id: req.body.subscriptions.id});
                                user.subscriptions.push(req.body.subscriptions);
                            }

                            user.markModified('subscriptions');
                        }

                        _.extend(user, reqUser);
                        user.save();
                        req.object = _.pick(user, '_id', 'image', 'username', 'email', 'roles');
                        next();
                    }
                });
        } else {
            res.send({error: 'unauthorized'});
        }
    } else if (req.busboy) {
        if (isAdmin || isTheUser) {
            Account.findById(req.params.id)
                .exec(function(err, user) {
                    if (err) return res.send(err);
                    else {
                        req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
                            var dirPath = mainSettings.filesPath + 'users',
                                newPath = mainSettings.filesPath + 'users/' + uuid.v4(),
                                pathTreat = newPath.replace(process.cwd() + '/public', '');

                            fs.exists(dirPath, function (exists) {
                                if (exists) {
                                    user.image = pathTreat;
                                    file.pipe(fs.createWriteStream(newPath));
                                } else {
                                    fs.mkdir(dirPath, 0755, function(err) {
                                        if (!err) {
                                            user.image = pathTreat;
                                            file.pipe(fs.createWriteStream(newPath));
                                        }
                                    });
                                }
                            });
                        });
                        req.busboy.on('finish', function() {
                            user.save();
                            req.object = _.pick(user, '_id', 'image', 'username', 'email');
                            next();
                        });

                        req.pipe(req.busboy);
                    }
                });
        }

    } else {
        res.send({error: 'empty'});
    }
}

module.exports = update;
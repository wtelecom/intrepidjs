/**
 * @file users_info.js
 * @namespace Users Info Middleware
 * @desc This module provides info about users
 */

var rek = require('rekuire'),
    _ = require('underscore'),
    settings = rek('/settings'),
    accountModel = rek('data/models/user/account');

function getUsers() {
    return function(req, res, next) {
        var usersCount = 0,
            globalCount = 0,
            currentDate = null,
            total_docs = 0,
            user_info_list = [];
        

        var m = accountModel.aggregate([]);
        m.group({_id: "$created", current_count: {$sum: 1}});
        m.sort({_id: 1});
        m.exec(function(err, grouped_users_list) {
            total_docs = grouped_users_list.length;
            _.each(grouped_users_list, function(accounts_doc) {
                if (usersCount > 0) {
                    var second_m = accountModel.aggregate([]);
                    second_m.match({created : {$gt: currentDate, $lte: accounts_doc._id}});
                    second_m.group({_id: null, count: {$sum: 1}});
                    second_m.exec(function(err, doc) {
                        var d = _.first(doc);
                        globalCount += d.count;
                        accounts_doc['global_count'] = globalCount;
                        user_info_list.push(accounts_doc);
                        total_docs --;
                        if (total_docs < 1) {
                            req.objects = user_info_list;
                            next();
                        }
                    });
                } else {
                    currentDate = accounts_doc._id;
                    globalCount = accounts_doc.current_count;
                    accounts_doc['global_count'] = globalCount;
                    user_info_list.push(accounts_doc);
                    total_docs --;
                    if (total_docs < 1) {
                        req.objects = user_info_list;
                        next();
                    }
                }
                usersCount ++;
                currentDate = accounts_doc._id;
            });
        });
    };
}

module.exports = getUsers;
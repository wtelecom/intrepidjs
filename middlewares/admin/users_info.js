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
        var globalCount = 0;
            m = accountModel.aggregate([]);

        m.project({day: {$substr: ["$created", 0, 10] },created: 1});
        m.group({_id: "$day", current_count: {$sum: 1}});
        m.project({_id: "$_id", current_count: "$current_count"});
        m.sort({_id: 1});
        m.exec(function(err, grouped_users_list) {
            _.each(grouped_users_list, function(o) {
                globalCount = globalCount + o.current_count;
                o.global_count = globalCount;
            });
            req.objects = grouped_users_list;
            next();
        });
    };
}

module.exports = getUsers;
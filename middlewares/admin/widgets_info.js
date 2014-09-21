/**
 * @file widgets_info.js
 * @namespace Modules Info Middleware
 * @desc This module provides info about modules
 */

var rek = require('rekuire'),
    widgetsModel = rek('data/models/widget/widget');

function getWidgets(available) {
    return function(req, res, next) {
        if (available) {
            // From common requests
            req.query['enabled'] = available;
            widgetsModel.getWidgets(req, next, 'widgets');
        } else {
            // From API requests (AngularJS)
            widgetsModel.getWidgetsInfo(req, next);
        }
    };
}

module.exports = getWidgets;
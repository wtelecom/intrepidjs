/**
 * @file widgets_update.js
 * @namespace Widgets Update Middleware
 * @desc This middleware updates widget info
 */

var rek = require('rekuire'),
    updateOperation = rek('libs/crud_operations/update'),
    widgetModel = rek('data/models/widget/widget');

function widgetUpdate() {
    return function(req, res, next) {
        updateOperation(widgetModel, {'name': req.body.name}, req.body, next);
    };
}

module.exports = widgetUpdate;
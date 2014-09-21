/**
 * @file timeline.js
 * @namespace Twitter timeline Middleware
 * @desc This module provides info about Twitter timeline
 */

var rek = require('rekuire'),
    _ = require('underscore'),
    createOperation = rek('libs/crud_operations/create'),
    updateOperation = rek('libs/crud_operations/update'),
    formValidation = rek('utils/form_validation'),
    postValidatorTreatment = rek('utils/post_validator'),
    widgetModel = rek('data/models/widget/widget');

function timelineOperations() {
    return function(req, res, next) {
        if (req.method == 'GET') {
            widgetModel.getWidgetsInfo(req, next);
        } else {
            formValidation(req.body, function(err) {
                if (err) {
                    res.json(
                        {
                            success: false
                        }
                    );
                } else {
                    var treatData = postValidatorTreatment(req.body);
                    widgetModel.find({'name':'timeline'}).
                        exec(function(err, widget) {
                            if (!_.isEmpty(widget)) {
                                updateOperation(widgetModel, {'name':'timeline'}, treatData, next);
                            } else {
                                treatData['enabled'] = false;
                                treatData['position'] = null;
                                treatData['order'] = null;
                                createOperation(widgetModel, treatData, next, req);
                            }
                        });
                }
            });
        }
    };
}

module.exports = timelineOperations;
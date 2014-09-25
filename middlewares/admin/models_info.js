/**
 * @file models_info.js
 * @namespace Models Info Middleware
 * @desc This module provides info about models
 */

var rek = require('rekuire'),
    _ = require('underscore'),
    settings = rek('/settings');

function getModels() {
    return function(req, res, next) {
        var modulesCount = [];
        var count = 0;
        var modelCount = 0;
        
        if (_.isEmpty(settings.modules)) {
            next();
        } else {
            _.each(settings.models, function(module) {
                _.each(module.models, function(model) {
                    count += 1;
                });
            });

            _.each(settings.models, function(module) {
                _.each(module.models, function(model) {
                    var tempModel = require(model.file);
                    tempModel.count({}, function(err, el_count) {
                        model['count'] = el_count;
                        modelCount ++;
                        if (modelCount == count) {
                            req.objects = settings.models;
                            next();
                        }
                    });
                });
            });
        }


        
    };
}

module.exports = getModels;
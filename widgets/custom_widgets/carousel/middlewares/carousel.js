/**
 * @file timeline.js
 * @namespace Twitter timeline Middleware
 * @desc This module provides info about Twitter timeline
 */

var rek = require('rekuire'),
    _ = require('underscore'),
    mainSettings = rek('/settings'),
    fs = require('fs'),
    uuid = require('node-uuid'),
    createOperation = rek('libs/crud_operations/create'),
    updateOperation = rek('libs/crud_operations/update'),
    formValidation = rek('utils/form_validation'),
    postValidatorTreatment = rek('utils/post_validator'),
    widgetModel = rek('data/models/widget/widget');

function carouselOperations() {
    return function(req, res, next) {
        if (req.method == 'GET') {
            widgetModel.getWidgetsInfo(req, next);
        } else {
            var formData = {};

            if (req.busboy) {
                req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
                    var dirPath = mainSettings.filesPath + 'widgets',
                        newPath = mainSettings.filesPath + 'widgets/' + uuid.v4(),
                        pathTreat = newPath.replace(process.cwd() + '/public', '');

                    fs.exists(dirPath, function (exists) {
                        if (exists) {
                            if (!formData['fields']) {
                                formData['fields'] = {
                                    value: [],
                                    type: 'array'
                                };
                            }
                            formData.fields.value.push({image: pathTreat});
                            file.pipe(fs.createWriteStream(newPath));
                        } else {
                            fs.mkdir(dirPath, 0755, function(err) {
                                if (!err) {
                                    formData['image'] = {
                                        value: pathTreat,
                                        type: 'text'
                                    };
                                    file.pipe(fs.createWriteStream(newPath));
                                }
                            });
                        }
                    });
                });

                req.busboy.on('field', function(key, value, keyTruncated, valueTruncated) {
                    formData[key] = JSON.parse(value);
                });

                req.busboy.on('finish', function() {
                    formValidation(formData, function(err) {
                        if (!err) {
                            var treatData = postValidatorTreatment(formData);
                            widgetModel.find({'name':'carousel'}).
                                exec(function(err, widget) {
                                    if (!_.isEmpty(widget)) {
                                        updateOperation(widgetModel, {'name':'carousel'}, treatData, next);
                                    } else {
                                        treatData['enabled'] = false;
                                        treatData['position'] = null;
                                        treatData['order'] = null;
                                        createOperation(widgetModel, treatData, next, req);
                                    }
                                });
                        } else {
                            res.json(
                                {
                                    success: false
                                }
                            );
                        }
                    });
                });

                req.pipe(req.busboy);

            } else {
                formValidation(req.body, function(err) {
                    if (!err) {
                        updateOperation(widgetModel, {'name':'carousel'}, postValidatorTreatment(req.body), next);
                    } else {
                        res.json(
                            {
                                success: false
                            }
                        );
                    }
                });
            }





            // formValidation(req.body, function(err) {
            //     if (err) {
            //         res.json(
            //             {
            //                 success: false
            //             }
            //         );
            //     } else {
            //         var treatData = postValidatorTreatment(req.body);
            //         widgetModel.find({'name':'timeline'}).
            //             exec(function(err, widget) {
            //                 if (!_.isEmpty(widget)) {
            //                     updateOperation(widgetModel, {'name':'timeline'}, treatData, next);
            //                 } else {
            //                     treatData['enabled'] = false;
            //                     treatData['position'] = null;
            //                     treatData['order'] = null;
            //                     createOperation(widgetModel, treatData, next, req);
            //                 }
            //             });
            //     }
            // });
        }
    };
}

module.exports = carouselOperations;
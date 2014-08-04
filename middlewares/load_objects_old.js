
/**
 * Save an element
 */

var settings = require('../../settings');

function loadObjects(model, subpath, conditions) {
    var modelObject = require(settings.modelsPath + subpath + model);

    return function loadObjects(req, res, next) {
        modelObject.find(conditions, function(err, objects) {
            if (err) {
                return next(err);
            }
            req.objects = objects;
            next();
        });
    };
}

module.exports = loadObjects;

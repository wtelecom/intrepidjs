
/**
 * Get objects
 */

var rek = require('rekuire');

function loadObjects(model, order, count, attr) {
    return function loadObjects(req, res, next) {
        model.getObjects(order, count, attr, req, next);
    };
}

module.exports = loadObjects;

/**
 * Get objects
 */

function getObjects(model, statics, params) {
    return function getObjects(req, res, next) {
        model[statics](req, next, params);
    };
}

module.exports = getObjects;
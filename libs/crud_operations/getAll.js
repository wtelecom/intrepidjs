
/**
 * Get elements
 */


function getObjects(model, query, fields, options, cb) {

    model.find(query, fields, options, function(err, doc) {
        if (err) {
            return cb(err);
        }
        cb();
    });
}

module.exports = getObjects;

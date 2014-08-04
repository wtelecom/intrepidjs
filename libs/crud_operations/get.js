
/**
 * Get an element
 */


function getObject(model, query, fields, options, cb) {

    model.findOne(query, fields, options, function(err, doc) {
        if (err) {
            return cb(err);
        }
        cb();
    });
}

module.exports = getObject;

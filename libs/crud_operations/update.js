
/**
 * Update an element
 */


function updateObject(model, query, data, cb) {

    model.findOneAndUpdate(query, data, function(err, doc) {
        if (err) {
            return cb(err);
        }
        cb();
    });
}

module.exports = updateObject;

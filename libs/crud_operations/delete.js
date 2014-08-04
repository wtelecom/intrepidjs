
/**
 * Update an element
 */


function deleteObject(model, query, cb) {

    model.findOne(query, function(err, doc) {
        if (err) return cb(err);
        if (doc) {
            doc.remove();
        }
        cb();
    });
}

module.exports = deleteObject;

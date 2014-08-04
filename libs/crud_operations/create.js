
/**
 * Save an element
 */


function createObject(model, data, cb, return_obj) {
    model.create(data, function(err, obj) {
        if (err) {
            return cb(err);
        }
        if (return_obj) {
            return_obj.object = obj;
            return cb();
        }
        return cb(obj);
    });
}

module.exports = createObject;
